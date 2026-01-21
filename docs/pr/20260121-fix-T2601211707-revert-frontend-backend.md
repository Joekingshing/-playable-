# PR: fix/T2601211707-revert-frontend-backend

## 背景 / 目标
- 还原之前对 monorepo frontend/backend 的改动，恢复模板示例与 users 模块。

## 变更摘要
- 回滚 frontend 与 backend 相关提交（工具条样式、首页内容、users 模块与导出演示调整）。

## 影响范围
- frontend/src/App.tsx
- frontend/src/App.css
- frontend/src/api/export.ts
- frontend/src/api/users.ts
- backend/apps/api/src/app.module.ts
- backend/apps/api/src/modules/users/*

## 风险与回滚
- 风险低：为恢复到更早状态的回滚。
- 回滚方式：回退本次 revert 提交 5085b51/4562fe7/812a9fc/fe939f7/6e6ca9b。

## 验证方式 / 结果
- (cd "E:\_wt\fix-T2601211707-revert-frontend-backend" && pnpm install)
- (cd "E:\_wt\fix-T2601211707-revert-frontend-backend/frontend" && pnpm build)
- (cd "E:\_wt\fix-T2601211707-revert-frontend-backend/backend" && pnpm build)

## 关键 Diff（自检）
6e6ca9b (HEAD -> fix/T2601211707-revert-frontend-backend) Revert "fix: stabilize export button render"
fe939f7 Revert "fix: remove users api surface"
812a9fc Revert "fix: make toolbar full-width"
4562fe7 Revert "fix: remove home template content"
5085b51 Revert "chore: remove unused app styles"
f81a120 (fullstack, chore/T2601211442-run-dev) merge: chore/T2601211701-api-port-6100
3b7b670 chore: add PR note
17df594 chore: change api port to 6100
9d2b48d merge: fix/T2601211658-clean-app-css
f9051fa chore: add PR note
4b24798 chore: remove unused app styles
0faf874 merge: fix/T2601211652-remove-home-hero
66e5260 chore: add PR note
fa548dd fix: remove home template content
46038dd merge: chore/T2601211643-api-port-6000
d1933e3 Merge branch 'fullstack' into chore/T2601211643-api-port-6000
5531b9a chore: add PR note
d0d79e0 chore: change api port to 6000
ac9804a merge: fix/T2601211644-toolbar-sticky
173a49a chore: add PR note

## Diff (fullstack...HEAD)

 backend/apps/api/src/app.module.ts                 |   3 +-
 .../apps/api/src/modules/users/users.controller.ts |  12 ++
 backend/apps/api/src/modules/users/users.module.ts |  11 ++
 .../apps/api/src/modules/users/users.service.ts    |  11 ++
 frontend/src/App.css                               | 146 +++++++++++++++++++--
 frontend/src/App.tsx                               |  71 +++++++++-
 frontend/src/api/export.ts                         |   1 -
 frontend/src/api/users.ts                          |  10 ++
 8 files changed, 247 insertions(+), 18 deletions(-)
