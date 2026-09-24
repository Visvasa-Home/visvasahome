import os
import uuid
import jwt
import httpx
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from shared.middleware import ObservabilityMiddleware
from shared.security import apply_security_headers, check_rate_limit
from shared.tracing import setup_tracing, instrument_fastapi

setup_tracing("api-gateway")

app = FastAPI(title="VisvasaHome API Gateway", version="2.0.0")

# ─── CORS ─────────────────────────────────────────────────────────────────────
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Observability & Security ─────────────────────────────────────────────────
app.add_middleware(ObservabilityMiddleware, service_name="api-gateway")

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        apply_security_headers(response)
        return response

app.add_middleware(SecurityHeadersMiddleware)

# ─── ServicePackage Registry ─────────────────────────────────────────────────────────
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")

SERVICES = {
    # Existing services
    "auth":         os.getenv("AUTH_SERVICE_URL",         "http://auth-service:3001"),
    "users":        os.getenv("USER_SERVICE_URL",         "http://user-service:3002"),
    "partners":     os.getenv("PARTNER_SERVICE_URL",      "http://partner-service:3003"),
    "catalog":      os.getenv("CATALOG_SERVICE_URL",      "http://catalog-service:3004"),
    "bookings":     os.getenv("BOOKING_SERVICE_URL",      "http://booking-service:3005"),
    "payments":     os.getenv("PAYMENT_SERVICE_URL",      "http://payment-service:3006"),
    "notifications": os.getenv("NOTIFICATION_SERVICE_URL", "http://notification-service:3007"),
    "ratings":      os.getenv("RATING_SERVICE_URL",       "http://rating-service:3008"),
    "admin":        os.getenv("ADMIN_SERVICE_URL",        "http://admin-service:3009"),
    "chat":         os.getenv("CHAT_SERVICE_URL",         "http://chat-service:3011"),
    # New services
    "amc":          os.getenv("AMC_SERVICE_URL",          "http://amc-service:3013"),
    "contractor":   os.getenv("CONTRACTOR_SERVICE_URL",   "http://contractor-service:3014"),
    "location":     os.getenv("LOCATION_SERVICE_URL",     "http://location-service:3015"),
    "complaints":   os.getenv("COMPLAINTS_SERVICE_URL",   "http://complaints-service:3016"),
    "analytics":    os.getenv("ANALYTICS_SERVICE_URL",    "http://analytics-service:3017"),
    "wallet":       os.getenv("WALLET_SERVICE_URL",       "http://wallet-service:3018"),
}

# ─── Public Paths (no JWT required) ──────────────────────────────────────────
PUBLIC_PATHS = {
    "auth/signup",
    "auth/send-otp",
    "auth/verify-otp",
    "auth/refresh",
    "catalog/categories",
    "catalog/services",
    "catalog/tree",
    "payments/webhooks/razorpay",
    "admin/coupons/validate",       # coupon validation used at checkout
    "admin/service-areas",          # public — used for partner onboarding
    "amc/plans",                    # public — customers browse AMC plans
}

# ─── Admin-only path prefix patterns ─────────────────────────────────────────
ADMIN_ONLY_PREFIXES = ("admin/", "analytics/", "wallet/admin/")
PARTNER_ALLOWED_PREFIXES = ("partners/", "bookings/", "location/", "wallet/", "contractor/")


def _is_public(path: str) -> bool:
    """Check if a path requires no authentication."""
    clean = path.lstrip("/")
    if clean in PUBLIC_PATHS:
        return True
    # GET catalog/services?category_id=... is public
    if clean.startswith("catalog/"):
        return True
    if clean.startswith("admin/coupons/validate/"):
        return True
    if clean.startswith("admin/service-areas"):
        return True
    if clean.startswith("amc/plans"):
        return True
    return False


# ─── Health check ─────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"status": "ok", "service": "api-gateway"}

@app.get("/_health")
async def health():
    return {"status": "ok", "service": "api-gateway", "version": "2.0.0"}


# ─── Main Gateway Handler ─────────────────────────────────────────────────────

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def gateway(request: Request, path: str):
    # 1. Rate limiting
    client_ip = request.client.host if request.client else "unknown"
    if not await check_rate_limit(client_ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please slow down.")

    # 2. Route to service
    parts = path.strip("/").split("/")
    service_name = parts[0] if parts else ""
    if service_name not in SERVICES:
        raise HTTPException(status_code=404, detail=f"ServicePackage '{service_name}' not found")

    target_url = f"{SERVICES[service_name]}/{path}"
    headers = dict(request.headers)
    headers.pop("host", None)

    # 3. Auth check
    is_public = _is_public(path)

    if not is_public:
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

        token = auth_header.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_id   = payload.get("sub", "")
        role      = payload.get("role", "")
        admin_role = payload.get("admin_role", "")

        # Inject user context headers for downstream services
        headers["x-user-id"]    = user_id
        headers["x-user-role"]  = role
        if admin_role:
            headers["x-admin-role"] = admin_role

        # 4. RBAC at gateway level
        clean_path = path.lstrip("/")

        # Admin-only endpoints
        if any(clean_path.startswith(prefix) for prefix in ADMIN_ONLY_PREFIXES):
            if role != "ADMIN":
                raise HTTPException(status_code=403, detail="Admin access required")

        # Wallet /admin/ sub-paths require ADMIN
        if clean_path.startswith("wallet/admin/"):
            if role != "ADMIN":
                raise HTTPException(status_code=403, detail="Admin access required")

    # 5. Forward request
    body = await request.body()

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body,
                params=request.query_params,
            )
        except httpx.ConnectError:
            raise HTTPException(status_code=503, detail=f"ServicePackage '{service_name}' is unavailable")
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail=f"ServicePackage '{service_name}' timed out")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Gateway error: {str(e)}")

    # 6. Strip hop-by-hop headers before forwarding response
    response_headers = dict(resp.headers)
    for h in ("content-length", "content-encoding", "transfer-encoding"):
        response_headers.pop(h, None)

    return Response(
        content=resp.content,
        status_code=resp.status_code,
        headers=response_headers,
        media_type=resp.headers.get("content-type"),
    )


instrument_fastapi(app, "api-gateway")
