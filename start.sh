#!/bin/sh
set -e

echo "🚀 Starting BORING Meal Planner..."

# Start Payload CMS in background on port 3002
echo "📦 Starting Payload CMS on port 3002..."
cd /app/payload
PORT=3002 HOSTNAME=0.0.0.0 NODE_OPTIONS="--no-deprecation" node server.js &
PAYLOAD_PID=$!

# Wait for Payload to be ready
echo "⏳ Waiting for Payload to start..."
sleep 8

# Start Nuxt frontend on PORT (Railway's port, defaults to 3000)
echo "🎨 Starting Nuxt frontend on port ${PORT:-3000}..."
cd /app/nuxt/.output/server
NUXT_PAYLOAD_API_URL=http://localhost:3002 HOST=0.0.0.0 node index.mjs &
NUXT_PID=$!

echo "✅ Both services started!"
echo "   Payload CMS: http://localhost:3002"
echo "   Nuxt Frontend: http://localhost:${PORT:-3000}"

# Handle shutdown
trap "kill $PAYLOAD_PID $NUXT_PID 2>/dev/null" EXIT

# Wait for either process to exit
wait -n $PAYLOAD_PID $NUXT_PID
