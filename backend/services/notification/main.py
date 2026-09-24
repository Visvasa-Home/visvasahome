from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
from typing import Dict
from shared.kafka_client import create_consumer, KafkaTopics
from shared.utils import logger, setup_logger
from shared.tracing import setup_tracing, instrument_fastapi
from shared.middleware import ObservabilityMiddleware

setup_logger("notification-service")
setup_tracing("notification-service")

app = FastAPI(title="Notification & Real-time ServicePackage")
app.add_middleware(ObservabilityMiddleware, service_name="notification-service")

from shared.redis_client import redis_client
import json

REDIS_NOTIFICATION_CHANNEL = "notification_ws_pubsub"

# WebSocket Connection Manager with Redis Pub/Sub
class ConnectionManager:
    def __init__(self):
        # Maps user_id to WebSocket on THIS node
        self.active_connections: Dict[str, WebSocket] = {}
        asyncio.create_task(self.redis_listener())

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        logger.info(f"WebSocket connected for user: {user_id}")

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            logger.info(f"WebSocket disconnected for user: {user_id}")

    async def send_personal_message(self, message: dict, user_id: str):
        # 1. Try local send
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_json(message)
                return
            except Exception as e:
                logger.error(f"Local send failed: {e}")
                self.disconnect(user_id)
        
        # 2. Publish to Redis so other nodes can deliver
        payload = json.dumps({"user_id": user_id, "message": message})
        await redis_client.publish(REDIS_NOTIFICATION_CHANNEL, payload)

    async def redis_listener(self):
        """Listens for notifications from other nodes and delivers locally."""
        pubsub = redis_client.pubsub()
        await pubsub.subscribe(REDIS_NOTIFICATION_CHANNEL)
        
        try:
            async for message in pubsub.listen():
                if message["type"] == "message":
                    data = json.loads(message["data"])
                    user_id = data.get("user_id")
                    payload_msg = data.get("message")
                    
                    if user_id in self.active_connections:
                        try:
                            await self.active_connections[user_id].send_json(payload_msg)
                        except Exception as e:
                            logger.error(f"Redis Pub/Sub local delivery failed: {e}")
                            self.disconnect(user_id)
        except Exception as e:
            logger.error(f"Redis Pub/Sub listener error: {e}")

manager = ConnectionManager()

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            # We just keep connection alive. Client doesn't send much to us.
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id)

import firebase_admin
from firebase_admin import credentials, messaging

# Initialize Firebase (requires FIREBASE_CREDENTIALS path in prod)
FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS")
try:
    if FIREBASE_CREDENTIALS and os.path.exists(FIREBASE_CREDENTIALS):
        cred = credentials.Certificate(FIREBASE_CREDENTIALS)
        firebase_admin.initialize_app(cred)
        logger.info("Firebase initialized successfully.")
    else:
        logger.warning("FIREBASE_CREDENTIALS not found. Running FCM in MOCK mode.")
except Exception as e:
    logger.warning(f"Firebase initialization failed (mocking Push): {e}")

def send_push(token, title, body):
    """
    Sends FCM Push Notification via Firebase Admin SDK.
    Critical for 'Instant Services' stack to wake up provider apps immediately.
    """
    logger.info(f"[MOCK FCM PUSH] To: {token} | Title: {title} | Body: {body}")
    
    if FIREBASE_CREDENTIALS and os.path.exists(FIREBASE_CREDENTIALS):
        try:
            message = messaging.Message(
                notification=messaging.Notification(title=title, body=body),
                token=token,
            )
            response = messaging.send(message)
            logger.info(f"Successfully sent FCM message: {response}")
        except Exception as e:
            logger.error(f"FCM send failed: {e}")

async def handle_event(topic, event):
    logger.info(f"Notification triggered for {topic}: {event}")
    
    # 1. Routing Kafka Events to WebSockets (via Redis Pub/Sub)
    if topic == "BOOKING_OFFERED":
        # Dispatched from Matching ServicePackage (Phase 2)
        partner_id = event.get("partner_id")
        await manager.send_personal_message({"type": "BOOKING_OFFERED", "payload": event.get("offer")}, partner_id)
        
    elif topic == "WALLET_CREDITED":
        # Dispatched from Payment ServicePackage (Phase 6)
        partner_id = event.get("partner_id")
        await manager.send_personal_message({"type": "WALLET_CREDITED", "payload": event}, partner_id)
        
    # 2. Push Notifications via Firebase Cloud Messaging
    elif topic == KafkaTopics.BOOKING_CREATED:
        send_push("customer_fcm_token", "Booking Confirmed", "We are finding a professional.")
    elif topic == KafkaTopics.BOOKING_ASSIGNED:
        send_push("customer_fcm_token", "Partner Assigned", "A partner will arrive soon.")
        partner_id = event.get("partner_id")
        send_push(f"{partner_id}_fcm_token", "New Booking", "You have a new booking!")
    elif topic == KafkaTopics.PAYMENT_COMPLETED:
        partner_id = event.get("partner_id")
        if partner_id:
            send_push(f"{partner_id}_fcm_token", "Payment Received", f"You earned Rs. {event.get('amount')}")

# Run Kafka Consumer in background
@app.on_event("startup")
async def startup_event():
    async def consume():
        topics = [
            KafkaTopics.BOOKING_CREATED,
            KafkaTopics.BOOKING_ASSIGNED,
            KafkaTopics.BOOKING_COMPLETED,
            KafkaTopics.PAYMENT_COMPLETED,
            "BOOKING_OFFERED",
            "WALLET_CREDITED"
        ]
        consumer = await create_consumer("notification-service-group", topics)
        await consumer.start()
        try:
            logger.info("Notification Consumer started...")
            async for msg in consumer:
                await handle_event(msg.topic, msg.value)
        finally:
            await consumer.stop()
            
    asyncio.create_task(consume())

instrument_fastapi(app, "notification-service")
