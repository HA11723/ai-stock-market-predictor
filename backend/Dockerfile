FROM python:3.11-slim

WORKDIR /app

# system deps for curl (healthcheck) and any other libs
RUN apt-get update && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

# install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy your code
COPY . .

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5001/health || exit 1

# run Flask app
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app", "--workers", "2"]
