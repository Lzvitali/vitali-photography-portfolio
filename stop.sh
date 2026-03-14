#!/bin/bash
# Stop the portfolio dev server

PID=$(lsof -i :3000 -sTCP:LISTEN -t 2>/dev/null)

if [ -z "$PID" ]; then
  echo "No dev server running on port 3000."
  exit 0
fi

kill "$PID" 2>/dev/null
sleep 1

if lsof -i :3000 -sTCP:LISTEN &>/dev/null; then
  kill -9 "$PID" 2>/dev/null
  echo "Force-stopped server (PID $PID)"
else
  echo "Server stopped (PID $PID)"
fi
