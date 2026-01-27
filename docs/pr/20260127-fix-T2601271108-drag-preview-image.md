# PR: fix/T2601271108-drag-preview-image

## 背景 / 目标
- 修复缩略图拖拽时默认 drag ghost 虚化/拉伸问题，使用自定义 drag image。

## 变更摘要
- 拖拽开始时创建离屏 <img> 作为 drag image，并按等比规则计算预览尺寸。

## 影响范围
- 前端缩略图拖拽预览效果（不影响上传/导出逻辑）。

## 风险与回滚
- 风险：极少数浏览器对 drag image 支持差异。
- 回滚：恢复 dragstart 处理逻辑即可。

## 验证方式 / 结果
- (cd "E:\_wt\fix-T2601271108-drag-preview-image\frontend" && pnpm build)
  - 首次失败：node_modules 缺失，tsc 找不到
  - 处理：在 E:\_wt\fix-T2601271108-drag-preview-image 根执行 pnpm install
  - 二次构建成功

## 关键 Diff（自检）
b279164 (HEAD -> fix/T2601271108-drag-preview-image) fix: use custom drag preview image
1271cb4 (spike/fullstack, chore/T2601271059-docsify-preview-4173) merge: chore/T2601271055-refresh-sidebar
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
92cbc38 merge: chore/er-diagram
52fa714 chore: update pr note
089a9dd chore: fix pr note encoding
6f694ae chore: add pr note for er diagram
07c4871 docs: add ER diagram

## Diff (spike/fullstack...HEAD)
 frontend/src/App.tsx | 68 ++++++++++++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 68 insertions(+)
