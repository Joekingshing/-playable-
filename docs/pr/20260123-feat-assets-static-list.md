# PR: feat/assets-static-list

## 变更摘要
- 新增 /assets 静态访问与 /assets/list 列表接口
- 上传返回补充 url 与 mtime，保持与列表一致

## 影响范围
- backend/apps/api/src/app.module.ts
- backend/apps/api/src/modules/assets/assets.constants.ts
- backend/apps/api/src/modules/assets/assets.controller.ts
- backend/apps/api/src/modules/assets/assets.module.ts
- backend/apps/api/src/modules/assets/assets.service.ts
- backend/apps/api/src/modules/upload/upload.service.ts

## 验证方式 / 结果
- (cd "$WT/backend" && pnpm build)

## 关键 Diff（自检）
bf2a30d (HEAD -> feat/assets-static-list) feat: add assets list and static access
7e20fd0 (origin/spike/fullstack, spike/fullstack) merge: docs/update-agents
00599bb docs: expand ER diagram guidance
7d8b26e merge: chore/preview-restart-7
c0b9d0d (chore/preview-restart-7) chore: restart preview services
afa7187 merge: feat/upload-toast-simple
9896d2e chore: add pr note and brief
61f7476 feat: simplify upload toast
cf21807 merge: feat/update-version
2248ebe chore: add pr review note
c3e0334 chore: bump version numbers
2fa6602 merge: chore/preview-restart-6
cddd5c0 (chore/preview-restart-6) chore: restart preview services
26f5ab2 merge: chore/preview-restart-5
fdd621f (chore/preview-restart-5) chore: restart preview services
b2949ef merge: feat/upload-toast
0befafb chore: add pr note and brief
ec714ba feat: show upload status in toast
86a15d1 merge: chore/preview-restart-4
3b12d5e (chore/preview-restart-4) chore: restart preview services

## Diff (spike/fullstack...HEAD)

 backend/apps/api/src/app.module.ts                 |   2 +
 .../api/src/modules/assets/assets.constants.ts     |  19 ++++
 .../api/src/modules/assets/assets.controller.ts    |  19 ++++
 .../apps/api/src/modules/assets/assets.module.ts   |   9 ++
 .../apps/api/src/modules/assets/assets.service.ts  | 112 +++++++++++++++++++++
 .../apps/api/src/modules/upload/upload.service.ts  |  13 ++-
 6 files changed, 170 insertions(+), 4 deletions(-)
