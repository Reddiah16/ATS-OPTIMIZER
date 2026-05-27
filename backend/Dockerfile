FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for psycopg2 and pdfplumber
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    libpoppler-cpp-dev \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Create upload/log directories
RUN mkdir -p uploads logs

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
