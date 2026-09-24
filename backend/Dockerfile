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

# Make script executable
RUN chmod +x start.sh

# Expose default port
EXPOSE 8000

# Default command
CMD ["./start.sh"]
