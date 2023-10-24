#!/bin/sh
set -e;
node /scripts/inject-variables.js /index.html;
exec "$@";