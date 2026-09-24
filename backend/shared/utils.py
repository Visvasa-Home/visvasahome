import logging
import json
from datetime import datetime

# Basic JSON response wrapper structure
def success_response(data=None, meta=None):
    resp = {"success": True}
    if data is not None:
        resp["data"] = data
    if meta is not None:
        resp["meta"] = meta
    return resp

def error_response(message: str):
    return {"success": False, "error": message}

# ── Structured Context-Aware JSON Logging ──────────────────────────────────────

class ContextAwareJSONFormatter(logging.Formatter):
    """
    Custom JSON formatter that automatically injects transaction_id, user_id, 
    and service_name from contextvars into every log record.
    """
    def format(self, record):
        from shared.middleware import transaction_id_var, user_id_var, service_name_var
        
        log_obj = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "transaction_id": transaction_id_var.get("-"),
            "user_id": user_id_var.get("-"),
            "service_name": service_name_var.get("-")
        }

        # Add any extra arguments passed to the logger
        if hasattr(record, "extra"):
            for k, v in record.extra.items():
                log_obj[k] = v

        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_obj)

def setup_logger(name: str = "visvasahome") -> logging.Logger:
    """Setup and return a JSON-formatted, context-aware logger."""
    logger = logging.getLogger(name)
    
    # Only add handler if none exist to prevent duplicate logs
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = ContextAwareJSONFormatter()
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        # Prevent propagation to root logger
        logger.propagate = False
        
    return logger

logger = setup_logger("visvasahome")
