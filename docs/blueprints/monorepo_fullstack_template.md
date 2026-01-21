# 项目生成任务文档

## 一、项目目标

构建一个**前后端分离但同仓（monorepo）**的现代 Web 工程模板，满足以下要求：

- **后端**：使用 **NestJS（TypeScript）**，采用模块化架构，支持多服务（多个 `main.ts` / 多个 App）。
- **前端**：使用 **React + Vite + TypeScript**，工程化配置清晰、可扩展。
- **任务脚本**：使用 **justfile** 统一管理开发、构建、测试、部署相关命令。
- **统一启动环境**：使用 **Docker Compose** 管理数据库及服务（并通过 profiles 区分 db/app/infra）。
- **结构清晰，可持续扩展**：支持共享代码（shared packages）、多环境（dev/staging/prod）配置与调试。

> 备注：本文档用于“生成模板工程”的任务说明与目录规范；你可以按本文档搭建脚手架，也可以把它作为团队统一约定（ADR/Conventions）的起点。

---

## 二、项目总体结构

推荐采用 **pnpm workspaces + NestJS monorepo + Vite 单独工程** 的同仓结构：

```text
myapp/
├── backend/                         # NestJS 后端（monorepo workspace）
│   ├── apps/                        # 多服务入口（每个 app 都有独立 main.ts）
│   │   ├── api/                     # 示例：REST API 服务（对外）
│   │   │   ├── src/
│   │   │   │   ├── main.ts
│   │   │   │   ├── app.module.ts
│   │   │   │   └── modules/
│   │   │   │       └── users/
│   │   │   │           ├── users.controller.ts
│   │   │   │           ├── users.service.ts
│   │   │   │           └── users.module.ts
│   │   │   └── test/
│   │   ├── worker/                  # 示例：后台任务/队列消费者（独立 main.ts）
│   │   │   └── src/main.ts
│   │   └── admin/                   # 示例：可继续扩展更多服务（如内部管理 API）
│   │       └── src/main.ts
│   ├── libs/                        # 可复用库（跨 app 共享）
│   │   ├── config/                  # 配置加载/校验（env schema）
│   │   ├── logger/                  # 日志封装（pino/winston）
│   │   ├── database/                # 数据库访问层（Prisma/TypeORM 等）
│   │   ├── clients/                 # 第三方 API 客户端封装
│   │   └── common/                  # 通用工具/DTO/异常/装饰器
│   ├── prisma/                      # Prisma schema 与 migrations（如选用 Prisma）
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── frontend/                        # React + Vite + TS 前端
│   ├── src/
│   │   ├── api/                     # API 调用封装（fetch/axios + hooks）
│   │   ├── components/
│   │   ├── pages/                   # 可选：按路由组织（或用 react-router）
│   │   ├── routes/                  # 可选：react-router 路由定义
│   │   ├── styles/
│   │   └── main.tsx
│   ├── public/
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── shared/                          # 可选：前后端共享类型、契约与工具
│   ├── api-schema/                  # OpenAPI（契约优先时）或 Protobuf 等
│   │   ├── openapi.yaml
│   │   └── paths/
│   ├── types/                       # 共享 TypeScript types（DTO/Enums）
│   └── utils/                       # 与运行时无关的纯函数/校验规则
│
├── docker/                          # Docker/Compose 配置与编排
│   ├── compose.yml                  # 主 Compose 文件（profiles 分类）
│   ├── env/                         # 多环境 env 文件（可选）
│   │   ├── dev.env
│   │   ├── staging.env
│   │   └── prod.env
│   └── services/                    # 可选：单服务 compose 片段（扩展用）
│
├── docs/                            # 文档目录（需求/设计/ADR/接口/运维）
│   ├── architecture/
│   └── api/
│
├── justfile                         # 任务管理（代替 Makefile）
├── package.json                     # 根 workspace（统一脚本、统一依赖策略）
├── pnpm-workspace.yaml              # pnpm monorepo 配置
├── .env.example                     # 环境变量模板（根目录统一）
├── .gitignore
├── README.md
└── LICENSE
```

---

## 三、主要技术栈

| 层级 | 技术 | 说明 |
| --- | --- | --- |
| 后端框架 | NestJS + TypeScript | 模块化、可扩展、适合多服务 |
| 后端运行时 | Node.js 20+ | 建议使用 LTS 版本 |
| ORM / DB 访问 | Prisma（推荐）/ TypeORM（二选一） | 推荐 Prisma：迁移流程成熟、类型体验好 |
| 配置管理 | @nestjs/config +（zod/joi）校验 | 支持多环境 `.env.*` |
| 日志 | pino（nestjs-pino）/ winston | 结构化日志、便于线上观测 |
| API 文档 | @nestjs/swagger（可选） | 生成/维护 OpenAPI |
| 前端框架 | React 18 + TypeScript | 组件化 UI |
| 构建工具 | Vite | 极速开发构建 |
| 前端请求 | fetch/axios +（React Query 可选） | 推荐封装统一 client |
| 任务脚本 | justfile | 单入口任务管理 |
| 容器化 | Docker + Docker Compose | 一键启动数据库与服务 |
| 数据库 | PostgreSQL | 默认选择（也可替换 MySQL） |
| 共享契约 | shared/types +（OpenAPI 可选） | 前后端共享 DTO/类型/契约 |

---

## 四、API 契约与共享类型规范（shared/ 可选）

> 目标：在 **MVP 阶段保持开发效率**（单人/小团队不被流程拖慢），同时保证未来能 **平滑升级为契约优先（OpenAPI）**。  
> 结论：默认采用 **方案 A（共享 TypeScript DTO）**，并按本节约定预留 **A → B** 的演进通道。

### 4.1 分阶段策略（推荐）

- **阶段 1（MVP / 单人开发）**：使用 **共享 TypeScript DTO（方案 A）** 做“类型一致性”与“快速迭代”。
- **阶段 2（多人协作 / 对外文档 / SDK）**：引入 **OpenAPI（方案 B）** 作为契约唯一真源（SSoT），并生成前端 types / 文档（必要时也可生成 client）。

> 关键点：无论选 A 还是 B，都要把 DTO 限制在“网络边界层”，避免侵入业务核心。这样后续升级成本最低。

---

### 方案 A：共享 TypeScript DTO（默认，轻量推荐）

#### 放什么（建议目录与内容）
- `shared/types/`：仅放 **无副作用** 的纯类型与纯常量（DTO/Enums/错误码/分页模型）。
  - `shared/types/dto/`：请求/响应 DTO（`CreateProjectRequest`、`ProjectResponse` 等）
  - `shared/types/enums/`：枚举（如导出状态、资源类型）
  - `shared/types/errors/`：错误码、错误结构
  - `shared/types/index.ts`：统一 export 入口

#### 用法约定（让后续好迁移到 OpenAPI）
1. **DTO 只用于 API 边界层**  
   - 后端：Controller 层接收/返回 DTO；业务层使用 Domain/Entity（不要把 DTO 传进核心 service）。
   - 前端：API client 使用 DTO 类型做静态检查。
2. **必须有运行时校验**（TS 类型本身不做网络边界校验）  
   - 后端：使用 `zod / class-validator` 在 Controller 入口校验（推荐在 pipe 中统一处理）。
3. **统一错误返回结构**（为 OpenAPI 契约做铺垫）  
   - 推荐格式：`{ code: string; message: string; details?: unknown; requestId?: string }`
4. **为可演进预留版本字段**  
   - 请求/响应中优先固定：`irVersion`、`templateVersion` 等关键版本字段（后续兼容更稳）。

> 提醒：共享类型 ≠ 共享运行时依赖。请确保 `shared/types` 不依赖任何前端框架代码、不引入后端框架装饰器，避免打包/运行时耦合。

---

### 4.2 A → B（OpenAPI）可演进约束（强烈建议执行）

如果你希望未来“很好改”，请在工程中强制以下边界：

- **Domain 与 DTO 分离**（推荐有 mapper）
  - `domain/*`：业务模型（Project/Asset/ExportJob/IR）
  - `dto/*`：API 入参出参（shared/types）
  - `mapper/*`：dto ↔ domain 的转换
- **API 语义提前规范化**
  - 统一状态码语义（400/401/403/404/409/422/500）
  - 上传使用 `multipart/form-data`，响应结构固定
  - 导出采用 job 模式：`queued/running/success/failed`（并在 DTO/enum 中固定）

做到以上两点后，升级到 OpenAPI 基本就是：
- 把 DTO 的来源从 `shared/types` → `openapi-typescript` 生成类型
- API client 换成 “OpenAPI 生成/校验” 的实现（可选）
- Domain 不动或极少动

---

### 4.3 何时升级到方案 B（OpenAPI 契约优先）

出现以下任意 **2 条**，建议升级到 B：
1. 前后端分工、多人协作增多（需要强契约防漂移）
2. 需要对外提供稳定 API 文档 / SDK
3. 需要版本化与兼容承诺（v1/v2）
4. 希望自动化：mock、契约测试、统一错误/状态码校验

---

### 方案 B：OpenAPI 模块化结构（契约优先，可选）

为支持多模块协作与生成工具兼容，OpenAPI 使用模块化文件结构：

- 入口文件：`shared/api-schema/openapi.yaml`
  - 维护顶层 `info`、`servers`、`tags`、`components.securitySchemes`。
  - `paths` 按接口逐条引用外部文件：
    - `/users` → `./paths/users/list.get.yaml`
    - `/users/{id}` → `./paths/users/detail.get.yaml`
  - `components.schemas` 逐项 `$ref` 指向外部 schema。

- 路径文件：`shared/api-schema/paths/<module>/<name>.<method>.yaml`
  - 每个文件仅描述单个 HTTP 方法（如 `list.get.yaml`）。
  - 文件内 `$ref` 使用相对路径跨文件（以当前文件为基准）。

- 组件文件：`shared/api-schema/components/schemas/<module>.yaml`
  - 每模块一个 schema 文件；跨模块公共模型放在 `common.yaml`。

- 命名规范
  - 目录/文件：kebab-case（`users`, `detail.get.yaml`）。
  - Schema 名：PascalCase（`User`、`UserListResponse`）。
  - Tag：PascalCase（`Users`、`Auth`）。

- 生成与同步（建议在 justfile 中固化）
  - bundle：把模块化 YAML 打包为单文件（便于生成代码/文档）
  - 前端 types：`openapi-typescript`
  - 文档：`redocly build-docs` 或 `openapi-generator markdown/html`


## 五、生成内容要求

### 1️⃣ 后端部分（NestJS）

#### 1. 初始化（建议）

- 后端以 **NestJS monorepo workspace** 形式初始化（一个 workspace 内含多个 app 与多个 lib）。
- 建议使用 **pnpm** 管理依赖，并在根目录统一锁文件。

> 推荐实践：后端的“多服务”以 `backend/apps/*` 表达，每个服务对应独立 `main.ts`（相当于多个 main）。

#### 2. 必需模块/目录

在 `backend/libs/` 中创建基础能力库（跨服务复用）：

- `libs/config/`：配置加载与校验（基于 `.env` / `.env.<mode>`）
- `libs/logger/`：日志封装（pino/winston），输出结构化日志
- `libs/database/`：数据库连接与访问（如 PrismaService / TypeORM DataSource）
- `libs/clients/`：第三方 API 客户端封装（HTTP client + 超时 + 重试 + tracing）
- `libs/common/`：通用 DTO、异常、响应包装器、装饰器、拦截器、守卫等

#### 3. 示例：用户模块（API 服务）

在 `backend/apps/api/src/modules/users/` 提供最小可运行示例：

- `users.controller.ts`：提供 `GET /users` 返回 JSON
- `users.service.ts`：调用 repo/ORM
- `users.module.ts`：模块声明与依赖注入

示例接口（建议）：

- `GET /health`：健康检查
- `GET /users`：返回用户列表（演示 DB 访问）

#### 4. 多服务（多个 main.ts）约定

- `backend/apps/api/src/main.ts`：对外 API（端口如 6000）
- `backend/apps/worker/src/main.ts`：后台任务/消费者（不暴露 HTTP 或仅暴露 metrics）
- `backend/apps/admin/src/main.ts`：内部管理（端口如 8081）

每个 app 建议拥有独立的：

- `APP_NAME`（用于日志与 tracing）
- `PORT`（或关闭 HTTP）
- `DATABASE_URL`（可共享同库、或拆库）

#### 5. 多环境配置与调试

- 根目录 `.env.example` 提供统一变量模板；实际运行可使用：
  - `.env`（默认）
  - `.env.development`
  - `.env.staging`
  - `.env.production`

后端建议约定：

- `NODE_ENV=development|staging|production`
- Nest `ConfigModule` 根据 `NODE_ENV` 选择 `envFilePath`

调试建议（VS Code）：

- 本地：`just backend-dev app=api`（watch 模式）
- 需要 Node Inspector 时：`NODE_OPTIONS=--inspect=0.0.0.0:9229`（可在 justfile 中提供 `backend-debug` 任务）

---

### 2️⃣ 前端部分（React + Vite + TS）

#### 1. 初始化

使用 Vite 初始化 React + TS 工程：

```bash
pnpm create vite frontend --template react-ts
```

（也可使用 npm/yarn，但建议与 monorepo 统一为 pnpm。）

#### 2. API 调用与环境变量

- Vite 环境变量建议使用 `VITE_` 前缀，例如：

```env
# frontend/.env.development
VITE_API_BASE_URL=http://localhost:6000
```

- 在 `frontend/src/api/` 中封装 `client.ts`（统一 baseUrl、headers、错误处理）。
- 可选：引入 React Query（@tanstack/react-query）管理请求缓存与状态。

#### 3. 本地联调（proxy 可选）

在 `frontend/vite.config.ts` 配置 proxy（可选）：

- `/api` → `http://localhost:6000`

以避免跨域/简化开发环境配置。

---

### 3️⃣ justfile 内容要求（统一命令管理）

> 核心目标：任何工作目录下执行 `just <task>` 都能复用同一套流程；并能方便选择不同后端 app（多 main）。

示例 justfile（可直接作为模板起点）：

```just
set shell := ["bash", "-cu"]
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
# app 可选：api / worker / admin
backend-dev app="api":
    cd backend && pnpm start:dev {{app}}

backend-build app="api":
    cd backend && pnpm build {{app}}

# Debug（可选）
backend-debug app="api":
    export NODE_OPTIONS="--inspect=0.0.0.0:9229" ; \
    cd backend && pnpm start:dev {{app}}

# -----------------------------
# Frontend (Vite)
# -----------------------------
frontend-dev:
    cd frontend && pnpm dev

frontend-build:
    cd frontend && pnpm build

# -----------------------------
# One-command Dev (recommended)
# -----------------------------
dev app="api":
    trap 'kill 0' INT TERM EXIT
    just up-db
    (just backend-dev app={{app}}) &
    backend_pid=$!
    (just frontend-dev) &
    frontend_pid=$!
    wait $backend_pid $frontend_pid

# -----------------------------
# Database (Prisma example, optional)
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
```

说明：

- `backend-dev app=api` 通过参数选择不同后端服务（满足“多个 main.ts”）。
- `dev app=api` 一键启动数据库 + 后端 + 前端（本地开发推荐）。
- 数据库任务以 Prisma 为例；若采用 TypeORM，则提供对应 migration 任务即可。

---

### 4️⃣ 数据库迁移与 Schema 管理流程（以 Prisma 为例）

如果使用 Prisma，建议流程如下：

1. **唯一真源**：所有表结构修改写入 `backend/prisma/schema.prisma`，禁止手写 SQL 迁移（除非特殊场景）。
2. **生成迁移**：执行 `just migrate-dev <name>`（内部调用 `prisma migrate dev --name <name>`），自动生成 `backend/prisma/migrations/*`。
3. **本地重建（可选）**：可提供 `reset` 任务（谨慎使用，仅本地开发）。
4. **部署迁移**：生产/CI 使用 `just migrate-deploy`（对应 `prisma migrate deploy`）。
5. **生成客户端**：`just prisma-generate`（对应 `prisma generate`）。

> 若选择 TypeORM：建议将 migrations 目录固定、并在 justfile 中提供 `migration:generate` / `migration:run` / `migration:revert` 任务。

---

### 5️⃣ docker/compose.yml 内容要求（按 profiles 分类）

示例 `docker/compose.yml`（可按需增删服务）：

```yaml
version: "3.9"

services:
  db:
    image: postgres:16
    profiles: ["db"]
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypass
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  # 可选：本地查看 DB
  pgadmin:
    image: dpage/pgadmin4:8
    profiles: ["infra"]
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - db

  # 后端 API（可选：容器化运行；本地开发也可不启）
  backend-api:
    build:
      context: ../backend
    profiles: ["app"]
    command: pnpm start:prod api
    env_file:
      - ../.env
    ports:
      - "6000:6000"
    depends_on:
      - db

  # 后端 Worker（可选）
  backend-worker:
    build:
      context: ../backend
    profiles: ["app"]
    command: pnpm start:prod worker
    env_file:
      - ../.env
    depends_on:
      - db

  # 前端（可选：容器化运行；更常见是本地 pnpm dev）
  frontend:
    build:
      context: ../frontend
    profiles: ["app"]
    command: pnpm preview --host 0.0.0.0 --port 3000
    ports:
      - "3000:3000"
    depends_on:
      - backend-api

volumes:
  db_data:
```

说明：

- 使用 `profiles` 将数据库（db）与应用（app）解耦，支持：
  - `just up-db` 仅启动数据库
  - `just up` 启动数据库 + 应用
- 容器化启动的 `command` 需要与你的 `backend/package.json` 脚本对应（如 `start:prod` 支持指定 app）。
- 若前端只用于本地开发，可不在 compose 启动前端服务，避免重复占用端口。

---

## 六、功能检查点（验收标准）

| 模块 | 验收点 | 验收方式 |
| --- | --- | --- |
| 后端多服务 | `just backend-dev app=api` / `app=worker` 可分别启动 | 控制台日志 |
| 数据库连接 | API 服务启动时能连接 Postgres（并可查询） | 控制台/DB 客户端 |
| REST API | 访问 `http://localhost:6000/users` 返回 JSON | 浏览器/curl |
| 前端 | `just frontend-dev` 启动后能访问页面 | 浏览器 |
| 前后端联调 | 前端能请求 API 并渲染用户列表 | 浏览器 |
| Docker 环境 | `just up` 可启动 db + app（按 profiles） | 控制台 |
| 一键开发 | `just dev app=api` 可同时启动 db + 后端 + 前端 | 控制台 |

---

## 七、扩展要求（可选）

- **多环境**：dev/staging/prod 的 env 与 compose 配置分层（如 `docker/env/*.env`）。
- **可观测性**：Prometheus metrics、OpenTelemetry tracing、健康检查聚合。
- **队列/缓存**：Redis + BullMQ（worker app 专用）。
- **API 契约自动化**：自动 bundle OpenAPI、生成前端 types、生成 API 文档（HTML/Markdown）。
- **CI/CD**：GitHub Actions（lint/test/build/docker build/push）。
- **代码规范**：ESLint + Prettier + commitlint + husky。

---

## 八、交付内容

1. 完整目录结构（符合本文规范）。
2. 可执行的项目模板（至少包含一个 `api` app + 一个 `worker` app + 一个前端应用）。
3. 可运行的 `justfile`（支持 dev/build/test/up/down 等任务）。
4. 可用的 Docker Compose 一键启动（数据库 + 可选服务）。
5. 根目录 `README.md`：说明依赖、启动步骤、常用命令与多环境使用方式。

---

## 九、启动指令参考

```bash
# 1) 初始化环境变量
cp .env.example .env

# 2) 安装依赖
just install

# 3) 仅启动数据库
just up-db

# 4) 启动开发（db + backend(api) + frontend）
just dev app=api

# 5) 切换启动其它后端服务
just backend-dev app=worker
just backend-dev app=admin

# 6) 构建
just build

# 7) 启动容器环境（db + app）
just up

# 8) 关闭环境
just down
```

---

## ✅ 预期结果

执行：

```bash
just dev app=api
```

- 数据库启动在 `localhost:5432`
- 后端 API 服务启动在 `http://localhost:6000`
- 前端启动在 `http://localhost:5173`（Vite 默认端口，按实际为准）
- 浏览器访问 `http://localhost:6000/users` 能返回数据
- 前端页面能成功请求并展示用户列表
