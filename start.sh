#!/usr/bin/env bash
set -e
cd src/full-project   # <- your subdir
# ensure correct env and port
exec gunicorn app:app -b 0127.0.0.1:${PORT:-5000}