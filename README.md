# Playable Monorepo Template

A fullstack monorepo scaffold with NestJS (multi-app) and Vite + React.

## Structure

- backend/            NestJS monorepo (apps/api, apps/worker, apps/admin)
- frontend/           Vite React app
- shared/             Shared DTOs, enums, utilities, and optional API schema
- docker/             Docker Compose for local infra

## Quick Start

`ash
cp .env.example .env
pnpm install
just up-db
just dev app=api
`

## Common Tasks

`ash
just backend-dev app=api
just backend-dev app=worker
just frontend-dev
just build
just up
just down
`

## Ports

- API: http://localhost:6000
- Admin: http://localhost:8081
- Frontend: http://localhost:5173
- Postgres: localhost:5432

## Notes

- Frontend API base: frontend/.env.development -> VITE_API_BASE_URL
- Backend config loads .env and .env.<NODE_ENV> from the repository root
