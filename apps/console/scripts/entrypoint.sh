#!/bin/sh
set -e;
node /app/scripts/inject-variables.js /app/index.html;
exec "$@";