#!/bin/bash

# Start all microservices in the background on different ports
uvicorn services.auth.main:app --host 127.0.0.1 --port 3001 &
uvicorn services.user.main:app --host 127.0.0.1 --port 3002 &
uvicorn services.partner.main:app --host 127.0.0.1 --port 3003 &
uvicorn services.catalog.main:app --host 127.0.0.1 --port 3004 &
uvicorn services.booking.main:app --host 127.0.0.1 --port 3005 &
uvicorn services.payment.main:app --host 127.0.0.1 --port 3006 &
uvicorn services.notification.main:app --host 127.0.0.1 --port 3007 &
uvicorn services.rating.main:app --host 127.0.0.1 --port 3008 &
uvicorn services.admin.main:app --host 127.0.0.1 --port 3009 &
uvicorn services.chat.main:app --host 127.0.0.1 --port 3011 &
uvicorn services.amc.main:app --host 127.0.0.1 --port 3013 &
uvicorn services.contractor.main:app --host 127.0.0.1 --port 3014 &
uvicorn services.location.main:app --host 127.0.0.1 --port 3015 &
uvicorn services.complaints.main:app --host 127.0.0.1 --port 3016 &
uvicorn services.analytics.main:app --host 127.0.0.1 --port 3017 &
uvicorn services.wallet.main:app --host 127.0.0.1 --port 3018 &
uvicorn services.matching.main:app --host 127.0.0.1 --port 3019 &

echo "All microservices started in background. Starting API Gateway..."

export AUTH_SERVICE_URL=http://127.0.0.1:3001
export USER_SERVICE_URL=http://127.0.0.1:3002
export PARTNER_SERVICE_URL=http://127.0.0.1:3003
export CATALOG_SERVICE_URL=http://127.0.0.1:3004
export BOOKING_SERVICE_URL=http://127.0.0.1:3005
export PAYMENT_SERVICE_URL=http://127.0.0.1:3006
export NOTIFICATION_SERVICE_URL=http://127.0.0.1:3007
export RATING_SERVICE_URL=http://127.0.0.1:3008
export ADMIN_SERVICE_URL=http://127.0.0.1:3009
export CHAT_SERVICE_URL=http://127.0.0.1:3011
export AMC_SERVICE_URL=http://127.0.0.1:3013
export CONTRACTOR_SERVICE_URL=http://127.0.0.1:3014
export LOCATION_SERVICE_URL=http://127.0.0.1:3015
export COMPLAINTS_SERVICE_URL=http://127.0.0.1:3016
export ANALYTICS_SERVICE_URL=http://127.0.0.1:3017
export WALLET_SERVICE_URL=http://127.0.0.1:3018

PORT=${PORT:-8000}
exec uvicorn gateway.main:app --host 0.0.0.0 --port $PORT
