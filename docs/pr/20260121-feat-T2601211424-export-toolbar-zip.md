# PR: feat/T2601211424-export-toolbar-zip

## 背景 / 目标
- 添加顶部工具条与导出功能，点击导出可下载 zip

## 变更摘要
- 前端：新增顶部工具条与导出下载调用
- 后端：新增 /export 导出接口，流式打包 playable-phaser
- 依赖：引入 archiver

## 影响范围
- frontend/src/App.tsx
- frontend/src/App.css
- frontend/src/api/client.ts
- frontend/src/api/export.ts
- backend/apps/api/src/modules/export/*
- backend/apps/api/src/app.module.ts
- backend/package.json
- pnpm-lock.yaml

## 风险与回滚
- 风险：EXPORT_SOURCE_PATH 路径不存在会返回 404
- 回滚：回退本分支提交

## 验证方式 / 结果
- (cd "E:\_wt\feat-T2601211424-export-toolbar-zip/backend" && pnpm build) ✅
- (cd "E:\_wt\feat-T2601211424-export-toolbar-zip/frontend" && pnpm build) ✅
- (cd "E:\_wt\feat-T2601211424-export-toolbar-zip" && pnpm install) ✅

## 关键 Diff（自检）
67137ff (HEAD -> feat/T2601211424-export-toolbar-zip) feat: add export toolbar and zip endpoint
2355fce (origin/fullstack, fullstack) chore: keep Function.md only at root folders
4b64777 chore: set playable-phaser dev port
701f0fc chore: add Function.md for directories
9f91126 feat: add playable-phaser scaffold
7ff836e chore: add react-creator skill
d4beeec chore: set frontend dev port to 8000
f5bab2b chore: update PR note
d7e0810 fix: make dev script windows-friendly
d6a7a45 chore: update sop-task-runner for PowerShell
53079b2 chore: add PR note
9668553 feat: scaffold fullstack monorepo template
1874fb7 (origin/main, main, feat/T2601201825-monorepo-fullstack-template, dev) chore: add gitattributes for lf
15d89ab chore: initial commit

## Diff (fullstack...HEAD)

 backend/apps/api/src/app.module.ts                 |   3 +-
 .../api/src/modules/export/export.controller.ts    |  30 +++
 .../apps/api/src/modules/export/export.module.ts   |   9 +
 .../apps/api/src/modules/export/export.service.ts  |  29 +++
 backend/package.json                               |   2 +
 frontend/src/App.css                               |  64 +++++
 frontend/src/App.tsx                               |  33 +++
 frontend/src/api/client.ts                         |   9 +
 frontend/src/api/export.ts                         |  35 +++
 pnpm-lock.yaml                                     | 265 +++++++++++++++++++++
 10 files changed, 478 insertions(+), 1 deletion(-)
