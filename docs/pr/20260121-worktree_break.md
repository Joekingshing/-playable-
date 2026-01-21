# PR: worktree_break

## 背景 / 目标
- 统一 worktree_break 文档中的后端默认端口为 6100。

## 变更摘要
- 更新 README.worktree.md 的默认端口说明。

## 影响范围
- README.worktree.md

## 风险与回滚
- 风险：无。
- 回滚：回退本分支提交。

## 验证方式 / 结果
- 未执行构建（仅文档变更）。
bd58ba1 (HEAD -> worktree_break) chore: update worktree port to 6100
f7284d3 (fullstack, fix/T2601211840-rollback, chore/T2601211840-worktree-setup) merge: feat/T2601211825-upload-image-frontend
a67508e chore: add PR note
3a42724 feat: connect image upload api
6f0ebda merge: feat/T2509162207-upload-image
84bb7cc Merge branch 'fullstack' into feat/T2509162207-upload-image
bf0ef2b chore: add PR note
f43df37 feat: add image upload endpoint
d6efb34 merge: feat/T2601211808-image-upload-area
104dbba chore: add PR note
b1486bd feat: add image upload area
375c9d8 merge: fix/T2601211707-revert-frontend-backend
3360d50 chore: add PR note
6e6ca9b Revert "fix: stabilize export button render"
fe939f7 Revert "fix: remove users api surface"
812a9fc Revert "fix: make toolbar full-width"
4562fe7 Revert "fix: remove home template content"
5085b51 Revert "chore: remove unused app styles"
f81a120 (chore/T2601211442-run-dev) merge: chore/T2601211701-api-port-6100
3b7b670 chore: add PR note

## Diff (fullstack...HEAD)

 README.worktree.md | 65 ++++++++++++++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 65 insertions(+)
