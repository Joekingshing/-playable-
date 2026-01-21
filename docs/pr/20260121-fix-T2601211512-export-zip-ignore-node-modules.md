# PR: fix/T2601211512-export-zip-ignore-node-modules

## 背景 / 目标
- 导出 zip 时排除 playable-phaser/node_modules

## 变更摘要
- 导出打包增加 node_modules 过滤

## 影响范围
- backend/apps/api/src/modules/export/export.service.ts

## 风险与回滚
- 风险：过滤规则过宽可能排除同名目录
- 回滚：回退本分支提交

## 验证方式 / 结果
- (cd "E:\_wt\fix-T2601211512-export-zip-ignore-node-modules" && pnpm install) ✅
- (cd "E:\_wt\fix-T2601211512-export-zip-ignore-node-modules/backend" && pnpm build) ✅
- 导出冒烟：启动临时端口 18080，下载 zip 并校验不包含 node_modules ✅

## 关键 Diff（自检）
4d8289f (HEAD -> fix/T2601211512-export-zip-ignore-node-modules) fix: exclude node_modules from export zip
55cc156 (fullstack) merge: fix/T2601211452-export-flicker
c023708 chore: add PR note
7073b7f fix: stabilize export button render
8c03e50 (chore/T2601211442-run-dev) merge: feat/T2601211424-export-toolbar-zip
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
9668553 feat: scaffold fullstack monorepo template
1874fb7 (origin/main, main, feat/T2601201825-monorepo-fullstack-template, dev) chore: add gitattributes for lf
15d89ab chore: initial commit

## Diff (fullstack...HEAD)

 backend/apps/api/src/modules/export/export.service.ts | 8 +++++++-
 1 file changed, 7 insertions(+), 1 deletion(-)
