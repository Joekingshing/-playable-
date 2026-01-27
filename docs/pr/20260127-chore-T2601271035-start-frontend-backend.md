# PR: chore/T2601271035-start-frontend-backend

## 背景 / 目标
- 启动前后端开发预览服务，便于当前会话继续联调/查看。

## 变更摘要
- 无代码变更；仅记录本次启动与验证信息。

## 影响范围
- 无业务影响。

## 风险与回滚
- 风险：无。
- 回滚：停止 dev 进程即可。

## 验证方式 / 结果
- (cd "E:\_wt\chore-T2601271035-start-frontend-backend"; pnpm install)
- 前端：pnpm dev（监听 8000）
- 后端：pnpm start:dev（监听 6100）
- 端口检查：8000/6100 LISTENING

## 关键 Diff（自检）
552575e (HEAD -> chore/T2601271035-start-frontend-backend, spike/fullstack, chore/serve-docsify-4173) merge: chore/preview-restart-10
4e920ea (chore/preview-restart-10) chore: restart preview services
478b7a2 merge: fix/dropzone-ignore-internal-drag
ae64ccd chore: add pr note and brief
abbe4ff fix: ignore internal drag in dropzone
2965aa3 merge: chore/preview-restart-9
e14c758 (chore/preview-restart-9) chore: restart preview services
c66c2cb (origin/spike/fullstack) docs: add progress conclusion
315b07f chore: add docs report folder
92cbc38 merge: chore/er-diagram
52fa714 chore: update pr note
089a9dd chore: fix pr note encoding
6f694ae chore: add pr note for er diagram
07c4871 docs: add ER diagram
1c32465 merge: chore/preview-restart-8
eabcc86 (chore/preview-restart-8) chore: restart preview services
919214c (feat/upload-assets-contract) merge: feat/sidebar-thumbnail-list
62c42bd chore: add pr note and brief
5ac6e25 feat: add sidebar asset thumbnail list
c98a163 merge: feat/assets-static-list
