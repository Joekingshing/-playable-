# PR: fix/T2601271448-internal-drag-guard

## 背景 / 目标
- 内部缩略图拖拽回左侧栏被当作上传，导致重复上传。

## 变更摘要
- 内部拖拽写入 application/x-asset 标识并在 drop 优先识别。
- 高亮与上传仅对外部文件拖拽生效，文件类型双重校验。

## 影响范围
- 前端左侧栏拖拽上传与高亮提示。

## 风险与回滚
- 风险：低，主要是拖拽判定逻辑调整。
- 回滚：移除 internal drag 标识与判定逻辑。

## 验证方式 / 结果
- (cd "E:\_wt\fix-T2601271448-internal-drag-guard" && pnpm install)
- (cd "E:\_wt\fix-T2601271448-internal-drag-guard\frontend" && pnpm build)

## 关键 Diff（自检）
3ca8347 (HEAD -> fix/T2601271448-internal-drag-guard) fix: prevent internal drag from triggering upload
8c61605 (spike/fullstack) merge: chore/T2601271404-restart-preview
41c7f00 (chore/T2601271404-restart-preview) chore: add preview restart brief and PR note
b31be50 merge: fix/T2601271401-drag-preview-sync
5790753 chore: add PR note and brief
1cdd0e3 fix: preload drag image sizes for preview
ad77eb9 merge: chore/T2601271214-restart-preview
5afeb26 (chore/T2601271214-restart-preview) chore: add preview restart brief and PR note
6051f88 merge: fix/T2601271205-drag-upload-guard
73ab1b2 chore: add PR note and brief
0d3dad8 fix: allow file drags to activate dropzone
020e4e0 merge: chore/T2601271115-restart-preview
a341b44 (chore/T2601271115-restart-preview) chore: add preview restart brief and PR note
5e29c7b merge: fix/T2601271108-drag-preview-image
762045e chore: add PR note and brief
b279164 fix: use custom drag preview image
1271cb4 (chore/T2601271059-docsify-preview-4173) merge: chore/T2601271055-refresh-sidebar
bac49ea chore: add PR note
b33f31d chore(docs): update sidebar
4561d3c merge: chore/T2601271035-start-frontend-backend

## Diff (spike/fullstack...HEAD)
 frontend/src/App.tsx | 68 +++++++++++++++++++++++++++++++++++++++++++++++++---
 1 file changed, 65 insertions(+), 3 deletions(-)
