"""
Prometheus metrics definitions for Visva Sahome microservices.

Usage:
    from shared.metrics import REQUEST_COUNT, REQUEST_LATENCY, record_request, mount_metrics

    # Mount the /metrics endpoint on your FastAPI app:
    mount_metrics(app)

    # Record a request manually (the middleware does this automatically):
    record_request(method="GET", path="/bookings", status=200, duration=0.05, service="booking-service")

Env vars:
    METRICS_ENABLED    default: "true"
"""

import os
import time
import logging

logger = logging.getLogger("visvasahome.metrics")

METRICS_ENABLED = os.getenv("METRICS_ENABLED", "true").lower() == "true"

# ── Metric Declarations ──────────────────────────────────────────────────────

try:
    from prometheus_client import (
        Counter,
        Histogram,
        Gauge,
        CollectorRegistry,
        generate_latest,
        CONTENT_TYPE_LATEST,
        REGISTRY,
    )

    REQUEST_COUNT = Counter(
        "http_requests_total",
        "Total HTTP requests received",
        ["method", "path", "status", "service"],
    )

    REQUEST_LATENCY = Histogram(
        "http_request_duration_seconds",
        "HTTP request latency in seconds",
        ["method", "path", "service"],
        buckets=[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0],
    )

    ERROR_COUNT = Counter(
        "http_errors_total",
        "Total HTTP 5xx errors",
        ["method", "path", "service"],
    )

    KAFKA_PUBLISH_COUNT = Counter(
        "kafka_publish_total",
        "Total Kafka events published",
        ["topic", "service"],
    )

    KAFKA_PUBLISH_ERRORS = Counter(
        "kafka_publish_errors_total",
        "Total Kafka publish errors",
        ["topic", "service"],
    )

    DB_QUERY_LATENCY = Histogram(
        "db_query_duration_seconds",
        "Database query latency",
        ["operation", "service"],
        buckets=[0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1.0],
    )

    ACTIVE_REQUESTS = Gauge(
        "http_active_requests",
        "Number of active HTTP requests",
        ["service"],
    )

    _PROMETHEUS_AVAILABLE = True

except ImportError:
    logger.warning("[metrics] prometheus_client not installed — metrics disabled")
    _PROMETHEUS_AVAILABLE = False

    # Provide no-op stubs so all import sites work without error
    class _Noop:
        def labels(self, **kwargs): return self
        def inc(self, *a, **kw): pass
        def observe(self, *a, **kw): pass
        def set(self, *a, **kw): pass
        def time(self): 
            from contextlib import contextmanager
            @contextmanager
            def _ctx(): yield
            return _ctx()

    REQUEST_COUNT = _Noop()
    REQUEST_LATENCY = _Noop()
    ERROR_COUNT = _Noop()
    KAFKA_PUBLISH_COUNT = _Noop()
    KAFKA_PUBLISH_ERRORS = _Noop()
    DB_QUERY_LATENCY = _Noop()
    ACTIVE_REQUESTS = _Noop()


# ── Helper Functions ─────────────────────────────────────────────────────────

def record_request(
    method: str,
    path: str,
    status: int,
    duration: float,
    service: str,
):
    """Record one completed HTTP request."""
    if not _PROMETHEUS_AVAILABLE or not METRICS_ENABLED:
        return
    try:
        REQUEST_COUNT.labels(method=method, path=path, status=str(status), service=service).inc()
        REQUEST_LATENCY.labels(method=method, path=path, service=service).observe(duration)
        if status >= 500:
            ERROR_COUNT.labels(method=method, path=path, service=service).inc()
    except Exception as e:
        logger.debug(f"[metrics] record_request error: {e}")


def record_kafka_publish(topic: str, service: str, success: bool = True):
    """Record a Kafka publish attempt."""
    if not _PROMETHEUS_AVAILABLE or not METRICS_ENABLED:
        return
    try:
        if success:
            KAFKA_PUBLISH_COUNT.labels(topic=topic, service=service).inc()
        else:
            KAFKA_PUBLISH_ERRORS.labels(topic=topic, service=service).inc()
    except Exception as e:
        logger.debug(f"[metrics] record_kafka_publish error: {e}")


def mount_metrics(app, path: str = "/metrics"):
    """
    Mount a /metrics endpoint on a FastAPI app that serves Prometheus text format.
    This is the endpoint Prometheus scrapes.
    """
    if not _PROMETHEUS_AVAILABLE or not METRICS_ENABLED:
        return

    from fastapi import Response

    @app.get(path, include_in_schema=False)
    async def metrics_endpoint():
        from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
        return Response(
            content=generate_latest(),
            media_type=CONTENT_TYPE_LATEST,
        )

    logger.info(f"[metrics] Prometheus /metrics endpoint mounted at '{path}'")
