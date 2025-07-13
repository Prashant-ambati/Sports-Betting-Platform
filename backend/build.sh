#!/bin/bash
set -e

echo "=== Starting build process ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo "=== Installing dependencies ==="
npm install --include=dev

echo "=== Building TypeScript ==="
npm run build

echo "=== Build completed successfully! ==="
ls -la dist/ 