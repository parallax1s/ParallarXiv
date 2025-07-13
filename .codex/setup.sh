#!/usr/bin/env bash
set -euo pipefail
echo "🚀  Setting up ParallarXiv workspace …"

# Python
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt

# Node / pnpm
corepack enable
pnpm install --frozen-lockfile --prefix frontend

# Lint & tests
ruff backend
black --check backend
eslint "frontend/**/*.{ts,tsx}"
pnpm --prefix frontend test --run

# Build Rapier WASM once
pnpm --prefix frontend exec vite build --emptyOutDir --mode test
echo "✅  Setup finished"
