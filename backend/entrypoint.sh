#!/bin/bash
set -e
# Apply database migrations
echo "Applying database migrations..."
python manage.py makemigrations --no-input
python manage.py migrate --no-input


# Create superuser if it doesn't exist
echo "Creating superuser if it doesn't exist..."
python manage.py setup_superuser || echo "Superuser already exists or creation failed"

# Clear old static files
echo "Clearing old static files..."
rm -rf /app/staticfiles/*

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Testing server rediness
echo "Testing server readiness..."
echo "Starting server..."
gunicorn azughai.wsgi:application --workers 4 --bind 0.0.0.0:8000 &
# Start the server
check_server_readiness() {
    curl -s --head --request GET http://localhost:8000/admin/ >/dev/null
}
echo "Waiting for server to be ready..."
while ! check_server_readiness; do
    sleep 1
done
# Stop the server
echo "Stopping server..."
kill $(pgrep gunicorn)


# Change user permission
echo "Changing user permissions..."
# crete the /app/media directory if it doesn't exist
mkdir -p /app/media/
# Set permissions for the media directory
chmod -R 775 /app/media/
#chown -R npuser:non_priv_users /app/media/

# Start Gunicorn server as npuser
echo "Starting server as npuser..."
su -s /bin/sh -c "gunicorn azughai.wsgi:application --workers 4 --bind 0.0.0.0:8000 --timeout 120" #npuser

