# PR: feat/update-version

## 变更摘要
- 将前端与后端版本号同步升级到 0.1.0。

## 影响范围
- 前端版本号定义文件 `frontend/package.json`
- 后端版本号定义文件 `backend/package.json`

## 验证方式 / 结果
- (cd "$WT/backend" && pnpm build)
- (cd "$WT/frontend" && pnpm build)
c3e0334 (HEAD -> feat/update-version) chore: bump version numbers
2fa6602 (spike/fullstack, feat/upload-toast-simple) merge: chore/preview-restart-6
cddd5c0 (chore/preview-restart-6) chore: restart preview services
26f5ab2 merge: chore/preview-restart-5
fdd621f (chore/preview-restart-5) chore: restart preview services
b2949ef merge: feat/upload-toast
0befafb chore: add pr note and brief
ec714ba feat: show upload status in toast
86a15d1 merge: chore/preview-restart-4
3b12d5e (chore/preview-restart-4) chore: restart preview services
8675a65 merge: feat/upload-filename-suffix
db39623 chore: add pr note and brief
62997b3 feat: append unique suffix to upload filenames
c69671a (origin/spike/fullstack) merge: chore/add-er-diagram-dir
e602574 chore: add pr note for ER_Diagram dir
d868171 chore(docs): add ER_Diagram directory
d4ad43f merge: chore/preview-restart-3
7c72513 (chore/preview-restart-3) chore: restart preview services
34b9f21 merge: feat/sidebar-resizer-line-hidden
b58d148 chore: add pr note and brief

## Diff (spike/fullstack...HEAD)
 backend/package.json  | 2 +-
 frontend/package.json | 2 +-
 2 files changed, 2 insertions(+), 2 deletions(-)
