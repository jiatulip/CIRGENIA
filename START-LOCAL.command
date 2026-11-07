#!/bin/bash
set -e
cd -- "$(dirname -- "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 22.13 or newer is required: https://nodejs.org/en/download/"
  echo "Press Return to close."
  read -r
  exit 1
fi

if [ ! -d "dist/client" ]; then
  echo "Building CIRGENIA for local preview..."
  ./node_modules/.bin/vinext build
fi

echo ""
echo "================================================"
echo "  CIRGENIA is starting at http://localhost:5173"
echo "  Keep this window open. Press Control+C to stop."
echo "================================================"
echo ""

(sleep 2 && open http://localhost:5173) &
./node_modules/.bin/vinext start --port 5173

