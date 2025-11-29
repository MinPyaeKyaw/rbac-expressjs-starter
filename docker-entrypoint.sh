#!/bin/sh
set -e

echo "⏳ Waiting for database to be ready..."
# Wait a bit for MySQL to be fully ready (healthcheck ensures it's up, but migrations need it to be fully ready)
sleep 5

echo "🔄 Running database migrations..."
npm run db:migrate || {
  echo "❌ Migration failed!"
  exit 1
}

echo "✅ Migrations completed successfully!"

echo "🌱 Running database seeds..."
npm run db:seed || {
  echo "❌ Seeding failed!"
  exit 1
}

echo "✅ Seeds completed successfully!"

echo "🚀 Starting application..."
exec "$@"

