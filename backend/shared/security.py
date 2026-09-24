"""
Security utilities for Visva Sahome backend:

  1. PII encryption / decryption    — Fernet (AES-128-CBC + HMAC-SHA256)
  2. Password hashing               — bcrypt via passlib
  3. Input sanitisation             — OWASP-recommended stripping
  4. OWASP security headers         — injected on every response
  5. Redis rate limiting            — sliding window counter per IP
  6. Razorpay webhook signature     — HMAC-SHA256 verification

Env vars:
  PII_ENCRYPTION_KEY   32-byte base64-urlsafe key (generate with Fernet.generate_key())
  RATE_LIMIT_PER_MINUTE  default: 100
"""

import os
import re
import hmac
import hashlib
import logging
import base64
from typing import Optional

logger = logging.getLogger("visvasahome.security")

# ── PII Encryption (Fernet / AES-128) ────────────────────────────────────────

_fernet = None

def _get_fernet():
    global _fernet
    if _fernet is not None:
        return _fernet
    try:
        from cryptography.fernet import Fernet
        key = os.getenv("PII_ENCRYPTION_KEY")
        if not key:
            # Auto-generate a key for dev; in prod this MUST be set
            key = Fernet.generate_key().decode()
            logger.warning(
                "[security] PII_ENCRYPTION_KEY not set — generated ephemeral key. "
                "Data will NOT survive restarts. Set this env var in production!"
            )
        _fernet = Fernet(key.encode() if isinstance(key, str) else key)
        return _fernet
    except ImportError:
        logger.warning("[security] 'cryptography' package not installed — PII encryption disabled")
        return None


def encrypt_pii(value: Optional[str]) -> Optional[str]:
    """
    Encrypt a PII string (phone, email, address line, Aadhaar, PAN).
    Returns base64-encoded ciphertext string, or the original value if
    encryption is unavailable.
    """
    if value is None:
        return None
    f = _get_fernet()
    if f is None:
        return value
    try:
        return f.encrypt(value.encode()).decode()
    except Exception as e:
        logger.error(f"[security] encrypt_pii failed: {e}")
        return value


def decrypt_pii(value: Optional[str]) -> Optional[str]:
    """Decrypt a previously encrypted PII value."""
    if value is None:
        return None
    f = _get_fernet()
    if f is None:
        return value
    try:
        return f.decrypt(value.encode()).decode()
    except Exception as e:
        logger.error(f"[security] decrypt_pii failed: {e}")
        return value


# ── Password Hashing (bcrypt) ─────────────────────────────────────────────────

try:
    from passlib.context import CryptContext
    _pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(plain: str) -> str:
        return _pwd_context.hash(plain)

    def verify_password(plain: str, hashed: str) -> bool:
        return _pwd_context.verify(plain, hashed)

except ImportError:
    logger.warning("[security] passlib not installed — password hashing unavailable")

    def hash_password(plain: str) -> str:
        return plain

    def verify_password(plain: str, hashed: str) -> bool:
        return plain == hashed


# ── Input Sanitisation (OWASP) ────────────────────────────────────────────────

# Patterns to reject / strip
_SCRIPT_TAG = re.compile(r"<script.*?>.*?</script>", re.IGNORECASE | re.DOTALL)
_HTML_TAG   = re.compile(r"<[^>]+>")
_NULL_BYTE  = re.compile(r"\x00")
_SQL_INJECT = re.compile(
    r"(--|;|/\*|\*/|xp_|UNION\s+SELECT|DROP\s+TABLE|INSERT\s+INTO|DELETE\s+FROM|ALTER\s+TABLE)",
    re.IGNORECASE,
)


def sanitize_input(value: str) -> str:
    """
    Strip dangerous characters from user-supplied strings.
    Should be applied to free-text fields before storage.
    Does NOT replace proper parameterised queries — those are enforced by SQLAlchemy.
    """
    if not isinstance(value, str):
        return value
    value = _NULL_BYTE.sub("", value)
    value = _SCRIPT_TAG.sub("", value)
    value = _HTML_TAG.sub("", value)
    value = value.strip()
    return value


def validate_no_sql_injection(value: str) -> bool:
    """Return False if obvious SQL injection patterns are detected."""
    return not bool(_SQL_INJECT.search(value))


# ── OWASP Security Headers ────────────────────────────────────────────────────

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "Content-Security-Policy": (
        "default-src 'self'; "
        "script-src 'self'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data:; "
        "connect-src 'self'; "
        "frame-ancestors 'none';"
    ),
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(self), camera=(), microphone=()",
    "Cache-Control": "no-store",
}


def apply_security_headers(response) -> None:
    """Add OWASP-recommended headers to a response object."""
    for key, value in SECURITY_HEADERS.items():
        response.headers[key] = value


# ── Razorpay Webhook Signature Verification ───────────────────────────────────

def verify_razorpay_signature(body: bytes, signature: str, secret: str) -> bool:
    """
    Verify Razorpay webhook HMAC-SHA256 signature.
    https://razorpay.com/docs/webhooks/validate-test/
    """
    try:
        expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)
    except Exception as e:
        logger.error(f"[security] Razorpay signature verification failed: {e}")
        return False


# ── Redis Rate Limiting (Sliding Window) ──────────────────────────────────────

RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "100"))


async def check_rate_limit(identifier: str, limit: int = RATE_LIMIT_PER_MINUTE) -> bool:
    """
    Sliding-window rate limiter backed by Redis.
    Returns True if the request is allowed, False if rate-limited.
    identifier is typically the client IP address.
    """
    try:
        import time
        from shared.redis_client import redis_client

        now = time.time()
        window_start = now - 60  # 1-minute window
        key = f"rate_limit:{identifier}"

        pipe = redis_client.pipeline()
        # Remove entries older than the window
        pipe.zremrangebyscore(key, "-inf", window_start)
        # Add current request timestamp
        pipe.zadd(key, {str(now): now})
        # Count requests in window
        pipe.zcard(key)
        # Set TTL so key expires automatically
        pipe.expire(key, 60)
        results = await pipe.execute()

        current_count = results[2]
        return current_count <= limit

    except Exception as e:
        logger.warning(f"[security] Rate limit check failed (allowing request): {e}")
        return True  # Fail open — don't block requests on Redis failure


# ── PCI-DSS: Payment Card Tokenisation helpers ────────────────────────────────

def mask_card_number(card_number: str) -> str:
    """Return only the last 4 digits — never store the full card number."""
    cleaned = re.sub(r"\D", "", card_number)
    return f"****{cleaned[-4:]}" if len(cleaned) >= 4 else "****"


def extract_last4(card_number: str) -> str:
    """Extract last 4 digits of a card number."""
    cleaned = re.sub(r"\D", "", card_number)
    return cleaned[-4:] if len(cleaned) >= 4 else "0000"
