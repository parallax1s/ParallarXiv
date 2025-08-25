# ParallarXiv

## Features

- FastAPI backend with Socket.IO support
- Next.js 14 frontend using React-Three-Fiber and Rapier.js
- Docker compose for local services (MongoDB, Qdrant, Postgres)
- Pre-commit hooks for Python and JS linting/formatting
- GitHub Actions CI with lint, tests and build

## Tech Stack

- **Backend:** Python 3.12, FastAPI, Socket.IO
- **Frontend:** Next.js, React-Three-Fiber, Rapier.js (WASM)
- **Infra:** Docker Compose (MongoDB, Qdrant, Postgres)

## Local Dev

1. Run `.codex/setup.sh` to install dependencies and run checks.
2. `docker-compose -f infra/docker-compose.yaml up` to start services.
   This now launches MongoDB, Qdrant and Postgres containers.
3. Set `POSTGRES_URL` if running the backend outside Docker:
   `export POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/papers`
4. `pnpm --prefix frontend dev` and `uvicorn app.main:app --reload --port 8000`.

## CI

Automated via GitHub Actions workflow in `.github/workflows/ci.yml`.

## Vercel DOI Lookup

The `docs/` directory hosts a minimal static site that lets you enter an
arXiv DOI or identifier (e.g. `10.48550/arXiv.2101.00001`,
`arXiv:2101.00001`, or `https://doi.org/10.48550/arXiv.2101.00001`) and
fetch metadata from the official arXiv API via its `id_list` parameter.

To publish this site, connect the repository to [Vercel](https://vercel.com)
and deploy. The included `vercel.json` routes the project so the `docs/`
folder is served from the root URL, eliminating the need for GitHub Pages.

## Licence

MIT
