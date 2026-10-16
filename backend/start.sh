#!/bin/bash

set -e

cd "$(dirname "$0")"

# Create venv if it doesn't exist
[ ! -d "venv" ] && python3 -m venv venv

# Activate venv
source venv/bin/activate
# alembic revision --autogenerate -m "add_otp_and_set_password_tokens"

# Install dependencies
# pip install --upgrade pip
pip install -r requirements.txt

# Check and upgrade Alembic migrations to latest version
# alembic upgrade head

# Note: For image processing to work, you also need to start the Celery worker:
# In a separate terminal, run: ./start_worker.sh
# Or manually: celery -A app.worker worker --loglevel=info

# Start the application
# uvicorn main:app --reload --host 0.0.0.0 --port 8000
python3 manage.py runserver