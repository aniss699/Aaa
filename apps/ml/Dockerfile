
FROM python:3.11-slim

WORKDIR /app

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copier requirements et installer dépendances Python
COPY apps/ml/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY apps/ml/ .

# Variables d'environnement obligatoires
ENV OFFLINE_MODE=true
ENV NO_EXTERNAL_CALLS=true
ENV TRANSFORMERS_OFFLINE=1
ENV HF_HUB_OFFLINE=1
ENV PYTHONPATH=/app

EXPOSE 8001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8001/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
