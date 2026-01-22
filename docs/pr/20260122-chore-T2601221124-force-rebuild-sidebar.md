# PR: chore/T2601221124-force-rebuild-sidebar

## 背景 / 目标
- 强制清理并重建 docs 侧边栏文件。

## 变更摘要
- 删除并重新生成 docs/_sidebar.md（结果一致）。

## 影响范围
- docs 侧边栏生成流程。

## 风险与回滚
- 无内容变更，无回滚需求。

## 验证方式 / 结果
- python scripts/generate_sidebar.py
- 结果：通过（重建后内容一致）。

## 关键 Diff（自检）
b8e63f6 (HEAD -> chore/T2601221124-force-rebuild-sidebar, spike/fullstack) merge: chore/T2601221120-refresh-sidebar
5b4c7c6 chore: add PR note
e3c0460 (origin/spike/fullstack) merge: chore/T2601221047-skill-creator
14bed32 chore: add PR note
4c1edad chore: add skill-creator bundle
1258133 merge: feat/T2601221031-menu-sidebar
6cd389f chore: add PR note
137ea43 feat: generate sidebar from menu config
a521aa4 merge: worktree_break
502be9c (worktree_break) chore: add PR note
bd58ba1 chore: update worktree port to 6100
f7284d3 (fix/T2601211840-rollback, chore/T2601211840-worktree-setup) merge: feat/T2601211825-upload-image-frontend
a67508e chore: add PR note
3a42724 feat: connect image upload api
6f0ebda merge: feat/T2509162207-upload-image
84bb7cc Merge branch 'fullstack' into feat/T2509162207-upload-image
bf0ef2b chore: add PR note
f43df37 feat: add image upload endpoint
d6efb34 merge: feat/T2601211808-image-upload-area
104dbba chore: add PR note

## Diff (spike/fullstack...HEAD)

