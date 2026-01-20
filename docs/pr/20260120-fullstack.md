# PR: fullstack

## Background / Goal
- Scaffold a fullstack monorepo template per docs/blueprints/monorepo_fullstack_template.md.

## Change Summary
- Add root workspace config (pnpm workspaces, justfile, .env.example, docker compose).
- Convert backend into a NestJS monorepo with api/worker/admin apps and shared libs.
- Scaffold a Vite React frontend with API client and sample users list.
- Add shared types package and minimal OpenAPI placeholder.
- Switch `just dev` to a Windows-friendly PowerShell runner.
- Fix UsersModule wiring to import DatabaseModule.

## Impact Scope
- New workspace layout under backend/, frontend/, shared/, docker/.

## Risks and Rollback
- Low risk; new scaffold only. Rollback by reverting this commit.

## Verification / Results
- pnpm -C E:\playable\backend build
- pnpm -C E:\playable\frontend build
- E:\Git\bin\bash.exe -lc "cd /e/playable && /c/Users/joe/scoop/shims/just.exe dev app=api duration=10"

## Key Diff (Self-check)
d7e0810 (HEAD -> fullstack) fix: make dev script windows-friendly
d6a7a45 (origin/fullstack) chore: update sop-task-runner for PowerShell
53079b2 chore: add PR note
9668553 feat: scaffold fullstack monorepo template
1874fb7 (origin/main, origin/dev, main, feat/T2601201825-monorepo-fullstack-template, dev) chore: add gitattributes for lf
15d89ab chore: initial commit

## Diff (dev...HEAD)

 .codex/skills/sop-task-runner/SKILL.md             |   77 +-
 .gitignore                                         |   16 +
 README.md                                          |   45 +-
 backend/.prettierrc                                |    4 +
 backend/README.md                                  |   98 +
 backend/apps/admin/src/admin.module.ts             |   11 +
 backend/apps/admin/src/health.controller.ts        |    9 +
 backend/apps/admin/src/main.ts                     |   12 +
 backend/apps/admin/tsconfig.app.json               |    8 +
 backend/apps/api/src/app.module.ts                 |   12 +
 backend/apps/api/src/health.controller.ts          |    9 +
 backend/apps/api/src/main.ts                       |   12 +
 .../apps/api/src/modules/users/users.controller.ts |   12 +
 backend/apps/api/src/modules/users/users.module.ts |   11 +
 .../apps/api/src/modules/users/users.service.ts    |   11 +
 backend/apps/api/test/app.e2e-spec.ts              |   25 +
 backend/apps/api/test/jest-e2e.json                |    9 +
 backend/apps/api/tsconfig.app.json                 |    8 +
 backend/apps/worker/src/main.ts                    |   11 +
 backend/apps/worker/src/worker.module.ts           |    9 +
 backend/apps/worker/tsconfig.app.json              |    8 +
 backend/eslint.config.mjs                          |   35 +
 backend/libs/clients/src/clients.module.ts         |    4 +
 backend/libs/clients/src/index.ts                  |    1 +
 backend/libs/clients/tsconfig.lib.json             |    9 +
 backend/libs/common/src/index.ts                   |    1 +
 backend/libs/common/tsconfig.lib.json              |    9 +
 backend/libs/config/src/config.module.ts           |   18 +
 backend/libs/config/src/index.ts                   |    1 +
 backend/libs/config/tsconfig.lib.json              |    9 +
 backend/libs/database/src/database.module.ts       |    8 +
 backend/libs/database/src/database.service.ts      |   12 +
 backend/libs/database/src/index.ts                 |    2 +
 backend/libs/database/tsconfig.lib.json            |    9 +
 backend/libs/logger/src/index.ts                   |    1 +
 backend/libs/logger/src/logger.module.ts           |    8 +
 backend/libs/logger/tsconfig.lib.json              |    9 +
 backend/nest-cli.json                              |   84 +
 backend/package.json                               |   72 +
 backend/tsconfig.build.json                        |    4 +
 backend/tsconfig.json                              |   37 +
 docker/compose.yml                                 |   60 +
 docs/pr/20260120-fullstack.md                      |   99 +
 frontend/.gitignore                                |   24 +
 frontend/README.md                                 |   73 +
 frontend/eslint.config.js                          |   23 +
 frontend/index.html                                |   13 +
 frontend/package.json                              |   30 +
 frontend/public/vite.svg                           |    1 +
 frontend/src/App.css                               |  133 +
 frontend/src/App.tsx                               |   78 +
 frontend/src/api/client.ts                         |   16 +
 frontend/src/api/users.ts                          |   10 +
 frontend/src/assets/react.svg                      |    1 +
 frontend/src/index.css                             |   25 +
 frontend/src/main.tsx                              |   10 +
 frontend/tsconfig.app.json                         |   28 +
 frontend/tsconfig.json                             |    7 +
 frontend/tsconfig.node.json                        |   26 +
 frontend/vite.config.ts                            |   12 +
 justfile                                           |   83 +
 package.json                                       |   11 +
 pnpm-lock.yaml                                     | 7052 ++++++++++++++++++++
 pnpm-workspace.yaml                                |    4 +
 scripts/dev.ps1                                    |   87 +
 shared/api-schema/openapi.yaml                     |    5 +
 shared/package.json                                |   10 +
 shared/tsconfig.json                               |   11 +
 shared/types/dto/index.ts                          |    4 +
 shared/types/enums/index.ts                        |    6 +
 shared/types/errors/index.ts                       |    6 +
 shared/types/index.ts                              |    3 +
 shared/utils/index.ts                              |    3 +
 73 files changed, 8661 insertions(+), 43 deletions(-)
