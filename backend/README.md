# Visva Sahome Backend — Python/FastAPI

A modern, async, microservices-based backend for the VisvasaHome marketplace built completely in Python (FastAPI). This is perfectly suited for your Kotlin Android App.

## 🏗️ Architecture

- **Python / FastAPI**: High performance API framework with automatic Swagger generation.
- **SQLAlchemy (Async)**: Core relational database ORM using PostgreSQL.
- **Redis (redis.asyncio)**: Caching, OTPs, and real-time geospatial location of providers (GEO commands).
- **Kafka (aiokafka)**: Event-driven communication between services.
- **Docker**: Containerization using Docker Compose.

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Docker and Docker Compose

### 2. Setup Environment Variables
```bash
cp .env.example .env
```

### 3. Start Infrastructure & Services
```bash
docker-compose up -d --build
```
This will spin up:
- Postgres on `5432`
- Redis on `6379`
- Zookeeper & Kafka on `9092`
- API Gateway on `http://localhost:3000`
- All Python microservices and consumers internally.

### 4. Database Migrations (Alembic)
Since this is an async SQLAlchemy setup, apply the schemas by running alembic inside one of the Python containers:
```bash
docker-compose exec auth-service alembic upgrade head
```
*(Note: For local testing, you can also let SQLAlchemy `create_all()` handle it if you modify the startup scripts).*

## 📦 Services Overview

1. **API Gateway (`:3000`)**: Handles rate-limiting, CORS, and JWT verification. Proxies to all other FastAPI services.
2. **Auth Service (`:3001`)**: JWT issuance, OTP, and user/partner signup.
3. **User Service (`:3002`)**: Customer profile and address management.
4. **Partner Service (`:3003`)**: Provider onboarding, KYC, and availability/location updates.
5. **Catalog Service (`:3004`)**: Browse services and categories.
6. **Booking Service (`:3005`)**: Core order management and state machine.
7. **Payment Service (`:3006`)**: Razorpay integration, webhook processing, and payout generation.
8. **Rating Service (`:3008`)**: Post-booking reviews and aggregate partner ratings.
9. **Admin Service (`:3009`)**: Dashboard analytics and partner approvals.
10. **Notification Consumer**: Listens to Kafka to send Email, SMS, and Push (FCM).
11. **Matching Consumer**: Listens to Kafka, queries Redis `GEO`, and matches bookings.
