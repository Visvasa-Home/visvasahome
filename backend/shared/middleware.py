"""
ObservabilityMiddleware — FastAPI middleware that wires together:
  1. Transaction ID propagation (UUID, passed via X-Transaction-ID header)
  2. Structured logging context (stored in contextvars so every log call
     in the request lifecycle includes transaction_id automatically)
  3. OpenTelemetry span creation wrapping each request
  4. Prometheus request count + latency recording

Usage:
    from shared.middleware import ObservabilityMiddleware
    app.add_middleware(ObservabilityMiddleware, service_name="booking-service")
"""

import time
import uuid
import logging
from contextvars import ContextVar
from typing import Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

# ── Context Variables ─────────────────────────────────────────────────────────

# These ContextVars are accessible from any coroutine in the same async context.
# They are the Python equivalent of CLS/AsyncHook in Node.js.
transaction_id_var: ContextVar[str] = ContextVar("transaction_id", default="-")
user_id_var: ContextVar[str] = ContextVar("user_id", default="-")
service_name_var: ContextVar[str] = ContextVar("service_name", default="visvasahome")

from shared.utils import logger


def get_transaction_id() -> str:
    """Retrieve the current request's transaction ID from async context."""
    return transaction_id_var.get("-")


# ── Middleware ────────────────────────────────────────────────────────────────

class ObservabilityMiddleware(BaseHTTPMiddleware):
    """
    Attaches to every FastAPI app. On each request it:
    - Reads or generates X-Transaction-ID
    - Stores it in transaction_id_var (async-context-local, no threading issues)
    - Creates an OTel span for the request
    - Records Prometheus metrics on completion
    - Adds X-Transaction-ID to the response
    """

    def __init__(self, app, service_name: str = "visvasahome"):
        super().__init__(app)
        self.service_name = service_name

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # ── 1. Transaction ID ─────────────────────────────────────────────
        txn_id = request.headers.get("x-transaction-id") or str(uuid.uuid4())
        token_txn = transaction_id_var.set(txn_id)

        # ── 2. User ID (set by gateway after JWT decode) ──────────────────
        uid = request.headers.get("x-user-id", "-")
        token_uid = user_id_var.set(uid)

        service_name_var.set(self.service_name)

        start_time = time.perf_counter()

        # ── 3. OTel Span ──────────────────────────────────────────────────
        span_ctx = None
        try:
            from shared.tracing import get_tracer
            tracer = get_tracer()
            span_name = f"{request.method} {request.url.path}"
            span_ctx = tracer.start_as_current_span(
                span_name,
                attributes={
                    "http.method": request.method,
                    "http.url": str(request.url),
                    "http.path": request.url.path,
                    "transaction.id": txn_id,
                    "user.id": uid,
                    "service.name": self.service_name,
                },
            )
            span_ctx.__enter__()
        except Exception:
            span_ctx = None  # tracing optional — never crash the request

        # ── 4. Active request gauge ───────────────────────────────────────
        try:
            from shared.metrics import ACTIVE_REQUESTS, _PROMETHEUS_AVAILABLE
            if _PROMETHEUS_AVAILABLE:
                ACTIVE_REQUESTS.labels(service=self.service_name).inc()
        except Exception:
            pass

        logger.info(
            f"[{self.service_name}] → {request.method} {request.url.path}",
            extra={"transaction_id": txn_id, "user_id": uid},
        )

        status_code = 500
        try:
            response = await call_next(request)
            status_code = response.status_code
        except Exception as exc:
            logger.exception(
                f"[{self.service_name}] Unhandled exception on {request.method} {request.url.path}",
                extra={"transaction_id": txn_id, "user_id": uid},
            )
            raise
        finally:
            duration = time.perf_counter() - start_time

            # ── 5. Prometheus metrics ─────────────────────────────────────
            try:
                from shared.metrics import record_request, ACTIVE_REQUESTS, _PROMETHEUS_AVAILABLE
                record_request(
                    method=request.method,
                    path=request.url.path,
                    status=status_code,
                    duration=duration,
                    service=self.service_name,
                )
                if _PROMETHEUS_AVAILABLE:
                    ACTIVE_REQUESTS.labels(service=self.service_name).dec()
            except Exception:
                pass

            # ── 6. Close OTel span ────────────────────────────────────────
            if span_ctx is not None:
                try:
                    span_ctx.__exit__(None, None, None)
                except Exception:
                    pass

            # ── 7. Reset context vars ─────────────────────────────────────
            transaction_id_var.reset(token_txn)
            user_id_var.reset(token_uid)

            logger.info(
                f"[{self.service_name}] ← {request.method} {request.url.path} "
                f"status={status_code} duration={duration:.3f}s",
                extra={"transaction_id": txn_id, "user_id": uid},
            )

        # ── 8. Propagate Transaction ID in response ───────────────────────
        response.headers["x-transaction-id"] = txn_id
        return response
