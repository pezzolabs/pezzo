#!/bin/sh
set -e;
node /app/scripts/inject-variables.js /app/src/index.html;
exec "$@";
