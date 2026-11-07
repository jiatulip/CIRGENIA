#!/bin/bash
set -e
cd -- "$(dirname -- "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Install Node.js 22.13 or newer: https://nodejs.org/en/download/"
  echo "Then reopen this launcher. Press Return to close."
  read -r
  exit 1
fi
node scripts/macbook.mjs
