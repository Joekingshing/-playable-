# PR: fix/T2601271205-drag-upload-guard

## 背景 / 目标
- 修复从系统文件管理器拖拽图片到侧边栏无法触发上传的问题。

## 变更摘要
- dragenter/dragover 仅依赖 isFileDrag 判定，确保能 preventDefault 并触发 drop。

## 影响范围
- 前端侧边栏拖拽上传交互。

## 风险与回滚
- 风险：极低（仅调整拖拽判定）。
- 回滚：恢复 dragenter/dragover 的 files.length 判断。

## 验证方式 / 结果
- (cd "E:\_wt\fix-T2601271205-drag-upload-guard" && pnpm install)
- (cd "E:\_wt\fix-T2601271205-drag-upload-guard\frontend" && pnpm build)

## 关键 Diff（自检）
0d3dad8 (HEAD -> fix/T2601271205-drag-upload-guard) fix: allow file drags to activate dropzone
020e4e0 (spike/fullstack) merge: chore/T2601271115-restart-preview
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
c66c2cb (origin/spike/fullstack) docs: add progress conclusion
315b07f chore: add docs report folder

## Diff (spike/fullstack...HEAD)
 frontend/src/App.tsx | 6 ------
 1 file changed, 6 deletions(-)
