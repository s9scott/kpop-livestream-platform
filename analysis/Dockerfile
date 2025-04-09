FROM python:3.9-slim

# Set working directory
WORKDIR /usr/src/app

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*  # Cleanup to reduce image size

# Copy files
COPY requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

RUN pip install -q -U google-genai

COPY gemini.py .

# Expose the Flask port
EXPOSE 5001

# Run the app
CMD ["python3", "gemini.py"]
