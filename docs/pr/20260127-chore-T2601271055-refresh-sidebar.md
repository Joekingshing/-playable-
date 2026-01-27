# PR: chore/T2601271055-refresh-sidebar

## 背景 / 目标
- 刷新 docs 侧边栏脚本产物。

## 变更摘要
- 运行 justfile 中的 gen-sidebar 脚本，更新 docs/_sidebar.md。

## 影响范围
- 文档侧边栏导航结构。

## 风险与回滚
- 风险低；如有问题，可回滚对应 commit。

## 验证方式 / 结果
- 执行 just gen-sidebar（脚本内已提交），输出显示生成成功。

## 关键 Diff（自检）
b33f31d (HEAD -> chore/T2601271055-refresh-sidebar) chore(docs): update sidebar
4561d3c (spike/fullstack) merge: chore/T2601271035-start-frontend-backend
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
1c32465 merge: chore/preview-restart-8
eabcc86 (chore/preview-restart-8) chore: restart preview services
919214c (feat/upload-assets-contract) merge: feat/sidebar-thumbnail-list

## Diff (spike/fullstack...HEAD)

 docs/_sidebar.md | 92 ++++++++++++++++++++++++++++++++++++++++++++++----------
 1 file changed, 76 insertions(+), 16 deletions(-)
