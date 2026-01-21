# PR: fix/T2601211536-vite-proxy-rewrite

## 背景 / 目标
- 修复前端 /api/export 404（代理路径未重写）

## 变更摘要
- Vite 代理将 /api 前缀重写为后端根路径

## 影响范围
- frontend/vite.config.ts

## 风险与回滚
- 风险：若后端未来加 /api 前缀，需要同步调整重写规则
- 回滚：回退本分支提交

## 验证方式 / 结果
- (cd "E:\_wt\fix-T2601211536-vite-proxy-rewrite" && pnpm install) ✅
- (cd "E:\_wt\fix-T2601211536-vite-proxy-rewrite/frontend" && pnpm build) ✅

## 关键 Diff（自检）
a6cc32c (HEAD -> fix/T2601211536-vite-proxy-rewrite) fix: rewrite api proxy for export
d7b4abc (fullstack, chore/T2601211442-run-dev) merge: fix/T2601211512-export-zip-ignore-node-modules
25abebe chore: add PR note
4d8289f fix: exclude node_modules from export zip
55cc156 merge: fix/T2601211452-export-flicker
c023708 chore: add PR note
7073b7f fix: stabilize export button render
8c03e50 merge: feat/T2601211424-export-toolbar-zip
32309f9 chore: add PR note
67137ff feat: add export toolbar and zip endpoint
2355fce (origin/fullstack) chore: keep Function.md only at root folders
4b64777 chore: set playable-phaser dev port
701f0fc chore: add Function.md for directories
9f91126 feat: add playable-phaser scaffold
7ff836e chore: add react-creator skill
d4beeec chore: set frontend dev port to 8000
f5bab2b chore: update PR note
d7e0810 fix: make dev script windows-friendly
d6a7a45 chore: update sop-task-runner for PowerShell
53079b2 chore: add PR note

## Diff (fullstack...HEAD)

 frontend/vite.config.ts | 6 +++++-
 1 file changed, 5 insertions(+), 1 deletion(-)
