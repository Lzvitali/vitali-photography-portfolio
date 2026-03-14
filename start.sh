#!/bin/bash
# Start the portfolio dev server (admin panel available at /admin)

cd "$(dirname "$0")"

# Check if already running
if lsof -i :3000 -sTCP:LISTEN &>/dev/null; then
  echo "Server is already running on http://localhost:3000"
  echo "Admin panel: http://localhost:3000/admin"
  exit 0
fi

echo "Starting dev server..."
echo ""
echo "  Public site:  http://localhost:3000"
echo "  Admin panel:  http://localhost:3000/admin"
echo ""
echo "To stop: ./stop.sh (or press Ctrl+C)"
echo "---"

npm run dev
