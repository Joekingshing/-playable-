# PR: fix/T2601221138-sidebar-relative-path

## 背景 / 目标
- 侧边栏加载请求出现 /docs/docs/_sidebar.md，导致内容为空。

## 变更摘要
- 移除重复配置，明确关闭 docsify relativePath。

## 影响范围
- docsify 侧边栏加载路径。

## 风险与回滚
- 仅文档配置变更，回滚本提交即可恢复。

## 验证方式 / 结果
- 手动刷新页面，侧边栏应正常显示内容。

## 关键 Diff（自检）
b965e3a (HEAD -> fix/T2601221138-sidebar-relative-path) fix(docs): disable docsify relativePath
98ba0ac (spike/fullstack) merge: fix/T2601221130-sidebar-empty
dc227a0 chore: add PR note
a241ae9 fix(docs): load sidebar with absolute paths
e718abc merge: fix/T2601221128-sidebar-path
3e8c4af chore: add PR note
1a1f13e fix(docs): load sidebar from docs
48001ba merge: chore/T2601221124-force-rebuild-sidebar
a94dc26 chore: add PR note
b8e63f6 merge: chore/T2601221120-refresh-sidebar
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

## Diff (spike/fullstack...HEAD)

 index.html | 3 +--
 1 file changed, 1 insertion(+), 2 deletions(-)
