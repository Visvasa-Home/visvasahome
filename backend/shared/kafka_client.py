import os
import json
import asyncio
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
from shared.utils import logger

KAFKA_BROKER = os.getenv("KAFKA_BROKERS", "kafka:9092")


class KafkaTopics:
    # Booking lifecycle
    BOOKING_CREATED   = "booking.created"
    BOOKING_CONFIRMED = "booking.confirmed"
    BOOKING_ASSIGNED  = "booking.assigned"
    BOOKING_EN_ROUTE  = "booking.en_route"
    BOOKING_ARRIVED   = "booking.arrived"
    BOOKING_STARTED   = "booking.started"
    BOOKING_COMPLETED = "booking.completed"
    BOOKING_CANCELLED = "booking.cancelled"
    BOOKING_MATCHED   = "booking.matched"
    BOOKING_OFFERED   = "booking.offered"

    # Payment / Wallet
    PAYMENT_INITIATED  = "payment.initiated"
    PAYMENT_COMPLETED  = "payment.completed"
    PAYMENT_FAILED     = "payment.failed"
    REFUND_INITIATED   = "refund.initiated"
    WALLET_CREDITED    = "wallet.credited"
    WALLET_DEBITED     = "wallet.debited"
    SETTLEMENT_PROCESSED = "settlement.processed"

    # Partner
    PARTNER_APPROVED    = "partner.approved"
    PARTNER_SUSPENDED   = "partner.suspended"
    PARTNER_LOCATION_UPDATE = "partner.location.update"
    PARTNER_ONLINE      = "partner.online"
    PARTNER_OFFLINE     = "partner.offline"

    # Reviews / Complaints
    RATING_SUBMITTED    = "rating.submitted"
    COMPLAINT_FILED     = "complaint.filed"
    COMPLAINT_RESOLVED  = "complaint.resolved"

    # AMC
    AMC_SUBSCRIBED      = "amc.subscribed"
    AMC_RENEWED         = "amc.renewed"
    AMC_EXPIRING_SOON   = "amc.expiring_soon"

    # Contractor
    CONTRACTOR_LEAD_CREATED  = "contractor.lead.created"
    QUOTATION_SUBMITTED      = "contractor.quotation.submitted"
    CONTRACT_AWARDED         = "contractor.contract.awarded"
    MILESTONE_COMPLETED      = "contractor.milestone.completed"

    # Safety
    SOS_TRIGGERED = "sos.triggered"


_producer = None


async def get_producer() -> AIOKafkaProducer:
    global _producer
    if not _producer:
        _producer = AIOKafkaProducer(
            bootstrap_servers=KAFKA_BROKER,
            value_serializer=lambda v: json.dumps(v, default=str).encode("utf-8"),
        )
        await _producer.start()
    return _producer


async def publish_event(topic: str, payload: dict) -> None:
    try:
        producer = await get_producer()
        headers = {}
        try:
            from opentelemetry.propagate import inject
            inject(headers)
        except ImportError:
            pass
            
        kafka_headers = [(k, v.encode("utf-8")) for k, v in headers.items()]
        await producer.send_and_wait(topic, payload, headers=kafka_headers)
        logger.info(f"[kafka] Published → {topic}")
    except Exception as e:
        logger.error(f"[kafka] Error publishing to {topic}: {e}")

def extract_trace_context(msg):
    """Extracts OpenTelemetry trace context from Kafka message headers."""
    try:
        from opentelemetry.propagate import extract
        if not msg.headers: return None
        # Convert list of tuples back to dict
        headers = {k: v.decode("utf-8") for k, v in msg.headers}
        return extract(headers)
    except ImportError:
        return None


async def create_consumer(group_id: str, topics: list) -> AIOKafkaConsumer:
    consumer = AIOKafkaConsumer(
        *topics,
        bootstrap_servers=KAFKA_BROKER,
        group_id=group_id,
        value_deserializer=lambda x: json.loads(x.decode("utf-8")),
        auto_offset_reset="earliest",
    )
    return consumer
