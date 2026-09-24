import os
import hmac
import hashlib
import json
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from shared.models import AuditLog

logger = logging.getLogger("visvasahome.security")

AUDIT_SECRET_KEY = os.getenv("AUDIT_SECRET_KEY", "fallback-dev-audit-key-do-not-use-in-prod")

def _generate_signature(event_type: str, user_id: str, service: str, payload: dict, timestamp: datetime) -> str:
    """Generate an HMAC-SHA256 signature for the audit log fields to ensure tamper resistance."""
    payload_str = json.dumps(payload, sort_keys=True) if payload else "{}"
    message = f"{event_type}|{user_id}|{service}|{payload_str}|{timestamp.isoformat()}"
    return hmac.new(
        AUDIT_SECRET_KEY.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

async def record_audit_event(
    db: AsyncSession,
    event_type: str,
    service: str,
    user_id: Optional[str] = None,
    ip_address: Optional[str] = None,
    payload: Optional[Dict[str, Any]] = None
):
    """
    Records a secure, append-only audit event in the database.
    Useful for compliance (logins, authorization checks, KYC updates, etc.).
    """
    try:
        now = datetime.utcnow()
        user_str = str(user_id) if user_id else ""
        
        signature = _generate_signature(
            event_type=event_type,
            user_id=user_str,
            service=service,
            payload=payload or {},
            timestamp=now
        )
        
        audit_entry = AuditLog(
            event_type=event_type,
            user_id=user_id,
            service=service,
            ip_address=ip_address,
            payload=payload,
            created_at=now,
            signature=signature
        )
        
        db.add(audit_entry)
        await db.commit()
    except Exception as e:
        logger.error(f"[audit] Failed to record audit event '{event_type}': {e}")
        await db.rollback()

def verify_audit_log(audit: AuditLog) -> bool:
    """
    Verify if an audit log entry has been tampered with.
    """
    user_str = str(audit.user_id) if audit.user_id else ""
    expected_signature = _generate_signature(
        event_type=audit.event_type,
        user_id=user_str,
        service=audit.service,
        payload=audit.payload or {},
        timestamp=audit.created_at
    )
    return hmac.compare_digest(expected_signature, audit.signature)
