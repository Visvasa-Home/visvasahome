"""
Distributed tracing via OpenTelemetry SDK.

Each service calls setup_tracing(service_name) on startup.
Spans are exported over OTLP (gRPC) to Jaeger (or Grafana Tempo).

Env vars:
  OTEL_EXPORTER_OTLP_ENDPOINT  default: http://jaeger:4317
  OTEL_SERVICE_NAME             fallback service name
  OTEL_ENABLED                  set to "false" to disable (e.g. in unit tests)
"""

import os
import logging

logger = logging.getLogger("visvasahome.tracing")

_is_render = os.getenv("RENDER", "false").lower() == "true"
OTEL_ENABLED = os.getenv("OTEL_ENABLED", "false" if _is_render else "true").lower() == "true"
_is_docker = os.path.exists('/.dockerenv')
_default_otlp = "http://jaeger:4317" if _is_docker else "http://localhost:4317"
OTLP_ENDPOINT = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", _default_otlp)

_tracer = None
_tracer_provider = None


def setup_tracing(service_name: str) -> None:
    """
    Initialise OpenTelemetry for the given service.
    Call once from the FastAPI app startup event.
    """
    global _tracer, _tracer_provider

    if not OTEL_ENABLED:
        logger.info(f"[tracing] OpenTelemetry disabled for {service_name}")
        return

    try:
        from opentelemetry import trace
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor
        from opentelemetry.sdk.resources import Resource
        from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

        resource = Resource.create({"service.name": service_name, "deployment.environment": os.getenv("NODE_ENV", "development")})
        provider = TracerProvider(resource=resource)

        exporter = OTLPSpanExporter(endpoint=OTLP_ENDPOINT, insecure=True)
        provider.add_span_processor(BatchSpanProcessor(exporter))

        trace.set_tracer_provider(provider)
        _tracer_provider = provider
        _tracer = trace.get_tracer(service_name)

        logger.info(f"[tracing] OpenTelemetry initialised for '{service_name}' → {OTLP_ENDPOINT}")

    except ImportError as e:
        logger.warning(f"[tracing] OpenTelemetry packages not installed, tracing disabled: {e}")
    except Exception as e:
        logger.warning(f"[tracing] Failed to initialise OpenTelemetry: {e}")


def get_tracer():
    """Return the configured tracer, or a no-op tracer if not initialised."""
    global _tracer
    if _tracer is None:
        try:
            from opentelemetry import trace
            return trace.get_tracer("visvasahome.noop")
        except ImportError:
            return _NoopTracer()
    return _tracer


def instrument_fastapi(app, service_name: str):
    """
    Auto-instrument a FastAPI app (creates spans for every route).
    Call after setup_tracing() and after all routes are registered.
    """
    if not OTEL_ENABLED:
        return
    try:
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
        FastAPIInstrumentor.instrument_app(app, server_request_hook=None)
        logger.info(f"[tracing] FastAPI auto-instrumented for '{service_name}'")
    except ImportError:
        logger.warning("[tracing] opentelemetry-instrumentation-fastapi not installed, skipping auto-instrumentation")
    except Exception as e:
        logger.warning(f"[tracing] FastAPI instrumentation failed: {e}")


def instrument_sqlalchemy(engine):
    """Auto-instrument SQLAlchemy engine to create DB spans."""
    if not OTEL_ENABLED:
        return
    try:
        from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
        SQLAlchemyInstrumentor().instrument(engine=engine)
        logger.info("[tracing] SQLAlchemy auto-instrumented")
    except ImportError:
        logger.warning("[tracing] opentelemetry-instrumentation-sqlalchemy not installed")
    except Exception as e:
        logger.warning(f"[tracing] SQLAlchemy instrumentation failed: {e}")


class _NoopTracer:
    """Fallback no-op tracer when OpenTelemetry is unavailable."""
    def start_as_current_span(self, name, **kwargs):
        from contextlib import contextmanager
        @contextmanager
        def _noop():
            yield None
        return _noop()
