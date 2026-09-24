import asyncio
import json
from shared.kafka_client import create_consumer, KafkaTopics
from shared.utils import logger
from shared.database import AsyncSessionLocal
from sqlalchemy.sql import text

async def ingest_event(event_type, payload):
    """
    Simulates an analytics pipeline (like Snowflake ingestion)
    by storing flattened event data for reporting.
    """
    logger.info(f"[Analytics Pipeline] Ingesting event {event_type}: {payload}")
    # In a real Snowflake setup, this would be a Snowpipe or batch insert.
    # Here, we just log it to represent the decoupled event ingestion.
    async with AsyncSessionLocal() as db:
        try:
            # We assume an `analytics_events` table exists in visvasahome_analytics DB
            # We just do a fire-and-forget raw insert for demonstration
            query = text("""
                CREATE TABLE IF NOT EXISTS analytics_events (
                    id SERIAL PRIMARY KEY,
                    event_type VARCHAR(255),
                    payload JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            await db.execute(query)
            
            insert_query = text("INSERT INTO analytics_events (event_type, payload) VALUES (:type, :payload)")
            await db.execute(insert_query, {"type": event_type, "payload": json.dumps(payload)})
            await db.commit()
        except Exception as e:
            logger.error(f"[Analytics Pipeline] Error ingesting event: {e}")

async def start_analytics_consumer():
    topics = [
        KafkaTopics.BOOKING_CREATED,
        KafkaTopics.PAYMENT_CAPTURED,
        KafkaTopics.PARTNER_REGISTERED,
        KafkaTopics.USER_SIGNUP
    ]
    consumer = await create_consumer("analytics-pipeline-group", topics)
    await consumer.start()
    logger.info("[Analytics Pipeline] Started listening for events...")
    
    try:
        async for msg in consumer:
            await ingest_event(msg.topic, msg.value)
    except asyncio.CancelledError:
        logger.info("[Analytics Pipeline] Stopping consumer...")
    finally:
        await consumer.stop()
