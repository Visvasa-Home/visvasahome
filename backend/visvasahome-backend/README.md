# Visvasahome — Backend API

Production-ready Django REST API for on-demand home services.  
Stack: Python 3.11 · Django 5 · DRF · PostgreSQL · Redis · Celery

---

## Quick Start (Local Dev)

```bash
# 1. Clone and setup
git clone https://github.com/visvasahome/backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# 2. Environment
cp .env.example .env
# Fill in your keys in .env

# 3. Database
python manage.py migrate
python manage.py createsuperuser --phone 9999999999

# 4. Run dev server
python manage.py runserver

# 5. Run Celery (new terminal)
celery -A visvasahome worker -l info

# 6. Run Celery Beat for scheduled tasks (new terminal)
celery -A visvasahome beat -l info
```

API Docs: http://localhost:8000/api/docs/  
Admin: http://localhost:8000/admin/

---

## API Endpoints

### Auth (no token needed)
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/v1/auth/send-otp/` | Send OTP to phone |
| POST | `/api/v1/auth/verify-otp/` | Verify OTP → get JWT tokens |
| POST | `/api/v1/auth/refresh/` | Refresh access token |

### Auth (Bearer token required)
| Method | URL | Description |
|--------|-----|-------------|
| GET/PATCH | `/api/v1/auth/profile/` | Get or update profile |
| POST | `/api/v1/auth/logout/` | Logout (blacklists refresh token) |

### Services (public)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/v1/services/` | List services (filter by ?city=Jaipur&category=plumbing) |
| GET | `/api/v1/services/categories/` | All categories with services |
| GET | `/api/v1/services/<slug>/` | Service detail |

### Bookings
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/v1/bookings/` | My bookings |
| POST | `/api/v1/bookings/create/` | Create booking |
| GET | `/api/v1/bookings/<id>/` | Booking detail |
| POST | `/api/v1/bookings/<id>/verify-otp/` | Provider verifies start OTP |
| GET | `/api/v1/bookings/amc/packages/` | Available AMC packages |
| GET/POST | `/api/v1/bookings/amc/contracts/` | My AMC contracts / Subscribe |

### Payments
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/v1/payments/create-order/` | Create Razorpay order |
| POST | `/api/v1/payments/verify/` | Verify payment signature |
| POST | `/api/v1/payments/webhook/` | Razorpay webhook (no auth) |

### Providers
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/v1/providers/` | List approved providers |
| POST | `/api/v1/providers/onboard/` | Submit provider application |

---

## Deployment (Railway — Phase 1)

```bash
# Procfile already handles this:
# web: gunicorn visvasahome.wsgi --workers 4 --bind 0.0.0.0:$PORT
# worker: celery -A visvasahome worker -l info
# beat: celery -A visvasahome beat -l info

# Production env vars to set in Railway:
DEBUG=False
DATABASE_URL=postgresql://... (Railway gives this)
REDIS_URL=redis://... (add Redis plugin)
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_urlsafe(50))")
ALLOWED_HOSTS=your-app.railway.app
```

## Scale to AWS (When you hit 10k+ bookings)

```
Current: Railway (free tier) → Switch to:
- EC2 t3.medium for Django (2 instances behind ALB)
- RDS PostgreSQL t3.micro → t3.small
- ElastiCache Redis
- S3 for media files (update MEDIA settings)
```
