#!/bin/sh

# Deploy prisma migration
npx prisma migrate deploy

# Start server
node main.js