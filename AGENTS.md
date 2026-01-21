# 📌 Playable Studio 仓库指南（AGENTS）

> **适用范围**：本仓库所有任务（React 编辑器 / NestJS 后端 / 模板工程 / IR & Codegen / 数据库 / 文档 / 脚本）  
> **核心目标**：保持“工作区隔离可追溯”、导出产物一致、构建必过、导出链路可回归。

---

## 0. Agent 输出要求（团队协作约束）

- **所有任务执行结果**（进度、结论、总结、风险、验证记录等）必须**使用中文**输出，便于同步。
- **重要**：只要涉及前端或后端代码更新，收尾务必做一次**构建校验**（二选一或都做，取决于改动范围）：
  - 前端编辑器：`(cd "$WT/apps/editor" && pnpm build)`
  - 后端服务：`(cd "$WT/apps/server" && pnpm build)`
- **导出链路相关改动**（模板 / codegen / export 服务）收尾必须做一次**导出冒烟**（推荐固定一个 demo 项目或固定 IR case）：
  - `（建议在 justfile 固化）(cd "$WT" && just export-smoke)`
- **建议**：遵循仓库的 git-worktree SOP（如果你已采用 worktree 流程）：每个任务一个 worktree，避免污染控制台目录。

---

## 1. 🧱 全局硬门槛：所有相关操作必须显式落到 `$WT`

> **定义**：`$WT` = 当前任务 worktree 根目录（例如 `../_wt/feat-xxx`）。  
> **目的**：避免在控制台目录生成缓存/产物/安装依赖等写入，保证 SOP 与可追溯性。

### 1.1 写操作的范围（只要“可能写文件”，就算）
以下全部视为“写操作”，必须显式落到 `$WT`：

- 代码/文档修改、新增、删除、移动、拷贝
- `pnpm install` / `pnpm -r build` / `pnpm lint` / `pnpm test` / codegen
- Prisma 迁移生成、Prisma client 生成
- 导出 zip 产物、临时目录写入、资源拷贝
- 任何会产生输出文件或写入目录的命令

### 1.2 两种合规写法（二选一，但必须统一）

**写法 A（推荐）**：显式在 `$WT` 目录执行
```bash
(cd "$WT" && <cmd>)
```

**写法 B（适合脚本/CI）**：显式指定工作目录（或工具自带的 `-C` / `--cwd` 等）
```bash
git -C "$WT" <cmd>
just --working-directory "$WT" <recipe> ...
```

### 1.3 禁止写法（高危）
- 禁止 `cd "$WT"` 单独写一行，下一行再执行命令（脚本/自动化场景尤其危险）。
- 禁止在控制台目录跑任何会写文件的命令（包括 install/build/codegen/migrate）。
- 禁止在控制台目录生成导出产物、Prisma migration、模板产物。

### 1.4 开始任务前的硬检查（必须做）
- 确认当前目录就是 `$WT`
- 确认当前 git 分支就是任务分支（例如 `$BR`）
- 如果不满足：**禁止进入下一步**

---

## 2. 项目结构与模块组织（React + NestJS Monorepo）

> 这是本项目约定的“同仓基础框架”。如果你调整目录结构，必须同步更新本文档与 justfile 任务。

- `apps/editor`：React 可视化编辑器（建议 Vite + TS + MUI + Konva）
- `apps/server`：NestJS 后端（项目/资源/导出/模板）
- `packages/ir`：IR 规范（types + zod 校验 + version）
- `packages/codegen`：代码生成器（IR → `src/generated/**`）
- `templates/playable-react-phaser3`：固定导出模板工程（React + Phaser3）
  - 固定区：`src/game/**`、`src/config/**`
  - 生成区：`src/generated/**`（导出器覆盖）
  - 资源区：`src/assets/**`（导出器覆盖）
- `shared/`（可选）：共享 DTO / enums / error codes 或 OpenAPI（见第 12 节）
- `storage/`（建议 gitignore）：本地导出产物、资源存储、临时目录

---

## 3. 构建、测试与开发命令（统一 `$WT` 版本）

### 3.1 依赖安装（工作区统一安装）
```bash
(cd "$WT" && pnpm install)
```

### 3.2 本地开发（可选）
```bash
(cd "$WT/apps/server" && pnpm start:dev)
(cd "$WT/apps/editor" && pnpm dev)
```

### 3.3 单独构建（收尾必做）
- 后端构建校验：
```bash
(cd "$WT/apps/server" && pnpm build)
```

- 前端构建校验：
```bash
(cd "$WT/apps/editor" && pnpm build)
```

> **特别重要**：只要前端或后端代码有更新，收尾必须至少跑一次对应构建校验。

### 3.4 Lint / Test（建议）
```bash
(cd "$WT" && pnpm -r lint)
(cd "$WT" && pnpm -r test)
```

> 单人开发可以先保证 build 通过；进入稳定期后再逐步补齐测试覆盖。

---

## 4. 数据库查询验证（只读硬约束，可选）

> 该约定用于避免误操作线上/本地数据。若你没有提供查询脚本，可使用 `psql` 或 Prisma Studio 做只读检查。

- 🚫 禁止：`UPDATE` / `DELETE` / `INSERT` / `TRUNCATE` 等写操作
- ✅ 建议：只读查询 + 通过 Prisma Studio 检查数据

示例（psql 只读）：
```bash
psql "$DATABASE_URL" -c "SELECT * FROM projects LIMIT 10;"
```

---

## 5. 🧭 数据库结构更新（Prisma，严禁手改迁移）

> ✅ 推荐 Prisma：类型体验好、迁移流程成熟、适合单人快速迭代。  
> 🚫 禁止手动编辑 `apps/server/prisma/migrations/*` 内的 SQL（除非你非常明确后果并在 PR 说明原因）。

### 唯一路径（顺序不能跳，且全部在 `$WT` 执行）
1) 修改 Prisma Schema：`apps/server/prisma/schema.prisma`  
2) 生成迁移（本地开发）：
```bash
(cd "$WT/apps/server" && pnpm prisma migrate dev --name <message>)
```
3) 生成 Prisma Client（若未自动触发）：
```bash
(cd "$WT/apps/server" && pnpm prisma generate)
```
4) 状态检查：
```bash
(cd "$WT/apps/server" && pnpm prisma migrate status)
```
5) 生产/CI 部署迁移（仅 deploy，不做 dev 重建）：
```bash
(cd "$WT/apps/server" && pnpm prisma migrate deploy)
```

---

## 6. 代码风格与命名约定

### 6.1 TypeScript（通用）
- 2 空格缩进（按项目 eslint/prettier 统一）
- 函数：camelCase
- 类型/接口/类：PascalCase
- 文件名：kebab-case 或 camelCase（二选一，项目内保持一致）

### 6.2 NestJS（后端）
- 以模块组织：`modules/<domain>/{controller,service,repo,dto}.ts`
- DTO 只用于网络边界层（Controller），业务层使用 Domain/Entity
- 日志建议结构化（nestjs-pino 或 winston）

### 6.3 React（编辑器）
- UI 组件：`components/`
- 业务特性：`features/<canvas|layers|inspector|assets|export>/`
- 状态：建议 Zustand + undo stack（或等价方案）
- 画布渲染：Konva 的坐标体系必须与导出 Phaser 坐标体系保持一致（避免后期一致性返工）

---

## 7. 前后端接口访问约定（当前默认：共享 DTO）

- 编辑器通过 `apps/editor/src/api/` 统一封装请求（不要在各处散落 fetch）。
- 类型复用优先从 `shared/types`（或 `packages/ir`）导入，避免重复定义。
- 文件上传建议用后端直传接口（multipart），资源预览提供可控的 `GET /assets/:id`。

> 若你未来切 OpenAPI（方案 B），建议再引入“生成 client + 契约测试”。

---

## 8. 模板工程与导出链路约定（强约束）

### 8.1 模板工程（Template）边界
- 模板固定区：`templates/playable-react-phaser3/src/game/**`、`src/config/**`  
- 导出器可覆盖：
  - `templates/playable-react-phaser3/src/generated/**`
  - `templates/playable-react-phaser3/src/assets/**`

> **禁止**：导出器改写模板固定区（否则导出包架构不再稳定，后续维护成本暴增）。

### 8.2 导出一致性基本要求
- 导出后运行效果必须与编辑器画布一致（位置/层级/缩放/旋转/origin）
- codegen 必须确定性：同一份 IR 生成的代码应稳定一致（便于回归与 diff）

---

## 9. 测试指南（建议最低可行）

- **导出冒烟**（最重要）  
  - 固定 1～3 个 demo 项目或固定 IR case
  - 每次改动模板/codegen/export 服务后跑一遍
- 前端：Vitest/React Testing Library（可选）
- 后端：Jest（Nest 默认）+ Supertest（接口冒烟，可选）

---

## 10. 行为保持式重构规范（单文件职责拆分）

目标：在不改变外部可观察行为前提下拆分职责，降低耦合、提升可读性与可测试性。

必须遵守：
1. **先钉住行为**：先补最小回归保护（单测/冒烟脚本/验证步骤 + 关键断言）
2. **小步可回退**：一次只做一种重构动作，每一步立刻验证
3. **按变化原因拆分**：以“为何变化”来划分模块
4. **收敛副作用**：IO/请求/缓存/全局状态隔离，核心逻辑尽量纯函数化
5. **命名与边界优先**：先命名概念再决定文件归属
6. **保持接口稳定**：如必须变更，提供迁移策略
7. **交付可复核**：说明改动、原因、影响文件、验证方法、风险点、回滚/后续建议

---

## 11. Commit 与 PR 指南

- 遵循 Conventional Commits（`feat:` / `fix:` / `chore:` 等）
- PR 必含：
  - 变更说明
  - 测试/构建证据（命令输出或截图）
  - 若涉及模板/codegen/export：必须附导出冒烟结果（截图或日志）

**硬要求**：凡涉及前端/后端改动，PR 收尾必须附：
- `(cd "$WT/apps/editor" && pnpm build)` 或/且 `(cd "$WT/apps/server" && pnpm build)`
- 以及对应输出记录

---

## 12. API 契约与共享类型规范（shared/ 可选）

> 当前项目默认采用 **方案 A：共享 TypeScript DTO**（效率优先），并为未来升级到 **方案 B：OpenAPI 契约优先** 预留通道。

### 方案 A（默认）：共享 TypeScript DTO
- `shared/types/`：DTO、枚举、错误码（纯类型/纯常量，无副作用）
- 后端：Controller 使用 DTO + 运行时校验（zod/class-validator）
- 前端：API client 复用 DTO 类型，避免重复定义

### A → B 可演进约束（强烈建议）
- DTO 只停留在 Controller 层；业务层使用 Domain/Entity
- 统一错误结构（`code/message/details/requestId`）
- 请求/响应带版本字段（例如 `irVersion`、`templateVersion`）

### 方案 B（可选）：OpenAPI 契约优先
当你开始多人协作/需要文档或 SDK 时启用：
- `shared/api-schema/`：维护 openapi.yaml（模块化结构可参考你现有模板规范）
- types：使用 `openapi-typescript` 生成前端 types（可选生成 client）
- 后端：可用 `@nestjs/swagger` 辅助生成/对齐，但建议把“契约真源”明确为 `shared/api-schema`

---

## 13. ✅ 最终收尾硬门槛（每个任务必须满足）

1) 所有写操作（含 install/build/test/codegen/migrate/export）均显式落到 `$WT`  
2) 变更已提交 commit  
3) 有前端/后端改动则必须附构建校验：
   - `(cd "$WT/apps/editor" && pnpm build)` 或/且 `(cd "$WT/apps/server" && pnpm build)`
4) 涉及模板 / codegen / 导出流程：必须跑一次导出冒烟并记录结果


## 14. 启动前后端的端口释放要求

- 启动前后端服务前，若端口已被占用，必须先关闭占用进程，再启动对应服务。
