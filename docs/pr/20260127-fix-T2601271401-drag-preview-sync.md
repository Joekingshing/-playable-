# PR: fix/T2601271401-drag-preview-sync

## 背景 / 目标
- 拖拽缩略图时禁止默认 ghost，确保预览清晰且等比。

## 变更摘要
- 拖拽预览使用离屏 <img>，同步 setDragImage。
- 预加载图片尺寸并在尺寸未知时使用 160px fallback。

## 影响范围
- 前端左侧缩略图拖拽预览效果。

## 风险与回滚
- 风险：极低（仅拖拽预览逻辑）。
- 回滚：恢复拖拽预览缓存逻辑。

## 验证方式 / 结果
- (cd "E:\_wt\fix-T2601271401-drag-preview-sync" && pnpm install)
- (cd "E:\_wt\fix-T2601271401-drag-preview-sync\frontend" && pnpm build)

## 关键 Diff（自检）
1cdd0e3 (HEAD -> fix/T2601271401-drag-preview-sync) fix: preload drag image sizes for preview
ad77eb9 (spike/fullstack) merge: chore/T2601271214-restart-preview
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
4fd8732 (chore/T2601271035-start-frontend-backend) chore: add preview start brief and PR note
552575e (chore/serve-docsify-4173) merge: chore/preview-restart-10
4e920ea (chore/preview-restart-10) chore: restart preview services
478b7a2 merge: fix/dropzone-ignore-internal-drag
ae64ccd chore: add pr note and brief

## Diff (spike/fullstack...HEAD)
 frontend/src/App.tsx | 32 +++++++++++++++++++++++++++++---
 1 file changed, 29 insertions(+), 3 deletions(-)
