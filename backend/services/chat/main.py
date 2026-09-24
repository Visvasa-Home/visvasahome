from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, and_
import uuid
import json
import jwt
import os

from shared.database import get_db, AsyncSessionLocal
from shared.models import ChatMessage, Booking, User
from shared.utils import logger, success_response
from shared.middleware import ObservabilityMiddleware
from shared.tracing import setup_tracing, instrument_fastapi

setup_tracing("chat-service")

app = FastAPI(title="Chat ServicePackage")
app.add_middleware(ObservabilityMiddleware, service_name="chat-service")

from shared.redis_client import redis_client
import asyncio

JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")
REDIS_CHAT_CHANNEL = "chat_messages_pubsub"

class ConnectionManager:
    def __init__(self):
        # Maps user_id to active WebSocket on THIS node
        self.active_connections: dict[str, WebSocket] = {}
        # Start background Redis subscriber
        asyncio.create_task(self.redis_listener())

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, receiver_id: str):
        # 1. Try sending locally if the user is connected to this node
        if receiver_id in self.active_connections:
            try:
                await self.active_connections[receiver_id].send_text(message)
                return
            except Exception as e:
                logger.error(f"Local send failed: {e}")
                
        # 2. Publish to Redis Pub/Sub so other nodes can deliver it
        payload = json.dumps({"receiver_id": receiver_id, "message": message})
        await redis_client.publish(REDIS_CHAT_CHANNEL, payload)

    async def redis_listener(self):
        """Listens for chat messages from other nodes and delivers locally."""
        pubsub = redis_client.pubsub()
        await pubsub.subscribe(REDIS_CHAT_CHANNEL)
        
        try:
            async for message in pubsub.listen():
                if message["type"] == "message":
                    data = json.loads(message["data"])
                    receiver_id = data.get("receiver_id")
                    payload_msg = data.get("message")
                    
                    if receiver_id in self.active_connections:
                        try:
                            await self.active_connections[receiver_id].send_text(payload_msg)
                        except Exception as e:
                            logger.error(f"Redis Pub/Sub local delivery failed: {e}")
                            self.disconnect(receiver_id)
        except Exception as e:
            logger.error(f"Redis Pub/Sub listener error: {e}")
            
manager = ConnectionManager()

def decode_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("sub")
    except Exception as e:
        return None

@app.websocket("/chat/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(...)):
    user_id = decode_token(token)
    if not user_id:
        await websocket.close(code=1008)
        return
        
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            # Expected payload: {"receiver_id": "...", "booking_id": "...", "content": "hello"}
            receiver_id = payload.get("receiver_id")
            booking_id = payload.get("booking_id")
            content = payload.get("content")
            
            if receiver_id and content:
                # Store in DB
                async with AsyncSessionLocal() as db:
                    msg = ChatMessage(
                        sender_id=uuid.UUID(user_id),
                        receiver_id=uuid.UUID(receiver_id),
                        booking_id=uuid.UUID(booking_id) if booking_id else None,
                        content=content
                    )
                    db.add(msg)
                    await db.commit()
                    await db.refresh(msg)
                    
                    # Forward to receiver if online
                    response_data = {
                        "id": str(msg.id),
                        "sender_id": user_id,
                        "receiver_id": receiver_id,
                        "booking_id": booking_id,
                        "content": content,
                        "created_at": msg.created_at.isoformat()
                    }
                    await manager.send_personal_message(json.dumps(response_data), receiver_id)
                    
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(user_id)

@app.get("/chat/history/{other_user_id}")
async def get_chat_history(other_user_id: str, booking_id: str = None, token: str = Query(...)):
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    async with AsyncSessionLocal() as db:
        query = select(ChatMessage).where(
            or_(
                and_(ChatMessage.sender_id == uuid.UUID(user_id), ChatMessage.receiver_id == uuid.UUID(other_user_id)),
                and_(ChatMessage.sender_id == uuid.UUID(other_user_id), ChatMessage.receiver_id == uuid.UUID(user_id))
            )
        ).order_by(ChatMessage.created_at.asc())
        
        if booking_id:
            query = query.where(ChatMessage.booking_id == uuid.UUID(booking_id))
            
        result = await db.execute(query)
        messages = result.scalars().all()
        
        return success_response([{
            "id": str(m.id),
            "sender_id": str(m.sender_id),
            "receiver_id": str(m.receiver_id),
            "content": m.content,
            "created_at": m.created_at.isoformat()
        } for m in messages])

@app.get("/chat/sessions")
async def get_chat_sessions(token: str = Query(...)):
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    async with AsyncSessionLocal() as db:
        # Group by the OTHER user ID that the current user has chatted with
        # Since we don't have a specific Session table, we'll find distinct participants
        # To make it simple for MVP, we just find all messages involving the user
        # and extract the unique set of other users.
        query = select(ChatMessage).where(
            or_(
                ChatMessage.sender_id == uuid.UUID(user_id),
                ChatMessage.receiver_id == uuid.UUID(user_id)
            )
        ).order_by(ChatMessage.created_at.desc())
        
        result = await db.execute(query)
        messages = result.scalars().all()
        
        sessions = {}
        for m in messages:
            other_user = m.receiver_id if str(m.sender_id) == user_id else m.sender_id
            other_id_str = str(other_user)
            
            if other_id_str not in sessions:
                sessions[other_id_str] = {
                    "other_user_id": other_id_str,
                    "last_message": m.content,
                    "last_message_at": m.created_at.isoformat(),
                    "booking_id": str(m.booking_id) if m.booking_id else None
                }
                
        return success_response(list(sessions.values()))

instrument_fastapi(app, "chat-service")
