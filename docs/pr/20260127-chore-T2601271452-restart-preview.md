# PR: chore/T2601271452-restart-preview

## 背景 / 目标
- 重启前后端预览服务，便于验证内部拖拽不触发上传。

## 变更摘要
- 无代码变更；记录本次启动与验证信息。

## 影响范围
- 无业务影响。

## 风险与回滚
- 风险：无。
- 回滚：停止 dev 进程即可。

## 验证方式 / 结果
- (cd "E:\_wt\chore-T2601271452-restart-preview"; pnpm install)
- 前端：pnpm dev（监听 8000）
- 后端：pnpm start:dev（监听 6100）
- 端口检查：8000/6100 LISTENING

## 关键 Diff（自检）
caa96c8 (HEAD -> chore/T2601271452-restart-preview, spike/fullstack) merge: fix/T2601271448-internal-drag-guard
4c8c5ae chore: add PR note and brief
3ca8347 fix: prevent internal drag from triggering upload
8c61605 merge: chore/T2601271404-restart-preview
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

## Diff (spike/fullstack...HEAD)
