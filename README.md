# ParallarXiv

## Features

- FastAPI backend with Socket.IO support
- Next.js 14 frontend using React-Three-Fiber and Rapier.js
- Docker compose for local services (MongoDB, Qdrant)
- Pre-commit hooks for Python and JS linting/formatting
- GitHub Actions CI with lint, tests and build

## Tech Stack

- **Backend:** Python 3.12, FastAPI, Socket.IO
- **Frontend:** Next.js, React-Three-Fiber, Rapier.js (WASM)
- **Infra:** Docker Compose (MongoDB, Qdrant)

## Local Dev

1. Run `.codex/setup.sh` to install dependencies and run checks.
2. `docker-compose -f infra/docker-compose.yaml up` to start services.
3. `pnpm --prefix frontend dev` and `uvicorn app.main:app --reload --port 8000`.

## CI

Automated via GitHub Actions workflow in `.github/workflows/ci.yml`.

## GitHub Pages DOI Lookup

The `docs/` directory hosts a minimal static site that lets you enter a DOI and
fetch metadata from the arXiv API. Enable GitHub Pages for this repository and
select the `docs` folder as the source to make the page available online.

## Licence

MIT
