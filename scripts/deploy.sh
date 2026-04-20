#!/bin/bash
set -e

echo "Deploying EMSC Academy..."

if [ "$1" = "frontend" ]; then
  echo "Building frontend..."
  cd frontend && npm run build
  echo "Frontend built"
  
elif [ "$1" = "backend" ]; then
  echo "Building backend..."
  cd backend && npm run build
  echo "Backend built"
  
elif [ "$1" = "all" ]; then
  echo "Building all..."
  cd backend && npm run build && cd ..
  cd frontend && npm run build && cd ..
  echo "All built"
  
else
  echo "Usage: ./scripts/deploy.sh [frontend|backend|all]"
  exit 1
fi