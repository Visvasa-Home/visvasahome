FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (e.g. for psycopg2, asyncpg, etc.)
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Set PYTHONPATH so absolute imports (like `from shared...`) work correctly
ENV PYTHONPATH=/app

# Expose default port
EXPOSE 8000

# Default command (can be overridden by docker-compose or Kubernetes manifests for different microservices)
CMD ["uvicorn", "services.booking.main:app", "--host", "0.0.0.0", "--port", "8000"]
