set shell := ["cmd.exe", "/c"]
set dotenv-load := true

# -----------------------------
# Workspace
# -----------------------------
install:
    pnpm -w install

lint:
    pnpm -w lint

test:
    pnpm -w test

build:
    pnpm -w build

# -----------------------------
# Docker Compose
# -----------------------------
up:
    docker compose -f docker/compose.yml --profile db --profile app up -d

up-db:
    docker compose -f docker/compose.yml --profile db up -d

up-app:
    docker compose -f docker/compose.yml --profile app up -d

down:
    docker compose -f docker/compose.yml down

logs:
    docker compose -f docker/compose.yml logs -f --tail=200

# -----------------------------
# Backend (NestJS monorepo)
# -----------------------------
# app: api / worker / admin
backend-dev app="api":
    cd backend && pnpm start:dev {{app}}

backend-build app="api":
    cd backend && pnpm build {{app}}

backend-debug app="api":
    set NODE_OPTIONS=--inspect=0.0.0.0:9229 && cd backend && pnpm start:dev {{app}}

# -----------------------------
# Frontend (Vite)
# -----------------------------
frontend-dev:
    cd frontend && pnpm dev

frontend-build:
    cd frontend && pnpm build

# -----------------------------
# One-command Dev
# -----------------------------
# app: api / worker / admin

dev app="api" duration="0":
    powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File scripts\dev.ps1 -App {{app}} -DurationSeconds {{duration}}

# -----------------------------
# Database (Prisma example)
# -----------------------------
prisma-generate:
    cd backend && pnpm prisma generate

migrate-dev name:
    cd backend && pnpm prisma migrate dev --name {{name}}

migrate-status:
    cd backend && pnpm prisma migrate status

migrate-deploy:
    cd backend && pnpm prisma migrate deploy

studio:
    cd backend && pnpm prisma studio

# -----------------------------
# Serve docs with docsify
# -----------------------------
docs-dev:
    pnpm dlx docsify-cli@latest serve docs -p 4173

# -----------------------------
# 从 menu 配置生成侧边栏结构
# -----------------------------
gen-sidebar:
    python scripts/generate_sidebar.py --commit
