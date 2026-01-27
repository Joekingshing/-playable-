# PR: chore/T2601271214-restart-preview

## 背景 / 目标
- 重启前后端预览服务，便于验证拖拽上传修复。

## 变更摘要
- 无代码变更；记录本次启动与验证信息。

## 影响范围
- 无业务影响。

## 风险与回滚
- 风险：无。
- 回滚：停止 dev 进程即可。

## 验证方式 / 结果
- (cd "E:\_wt\chore-T2601271214-restart-preview"; pnpm install)
- 前端：pnpm dev（监听 8000）
- 后端：pnpm start:dev（监听 6100）
- 端口检查：8000/6100 LISTENING

## 关键 Diff（自检）
6051f88 (HEAD -> chore/T2601271214-restart-preview, spike/fullstack) merge: fix/T2601271205-drag-upload-guard
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
abbe4ff fix: ignore internal drag in dropzone
2965aa3 merge: chore/preview-restart-9
e14c758 (chore/preview-restart-9) chore: restart preview services

## Diff (spike/fullstack...HEAD)
