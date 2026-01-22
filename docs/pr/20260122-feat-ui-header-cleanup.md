# PR: feat/ui-header-cleanup

## 变更摘要
- 删除首页模板示例内容（标题/描述/状态卡/Users 列表）
- 顶部工具条改为全宽吸顶 Header，内容对齐页面左右 padding

## 影响范围
- 前端 UI：rontend/src/App.tsx、rontend/src/App.css

## 验证方式 / 结果
- (cd "E:\\_wt\\feat-ui-header-cleanup/frontend" && pnpm build)

## 关键 Diff（自检）
3ad69b0 (HEAD -> feat/ui-header-cleanup) feat: simplify editor header layout
b78d07b (origin/spike/fullstack, spike/fullstack, chore/start-frontend-backend) chore: update docs sidebar and configs
0061806 chore(docs): fix docsify paths
cffb24c merge: fix/T2601221138-sidebar-relative-path
bc2e26a chore: add PR note
b965e3a fix(docs): disable docsify relativePath
98ba0ac merge: fix/T2601221130-sidebar-empty
dc227a0 chore: add PR note
a241ae9 fix(docs): load sidebar with absolute paths
e718abc merge: fix/T2601221128-sidebar-path
3e8c4af chore: add PR note
1a1f13e fix(docs): load sidebar from docs
48001ba merge: chore/T2601221124-force-rebuild-sidebar
a94dc26 chore: add PR note
b8e63f6 merge: chore/T2601221120-refresh-sidebar
5b4c7c6 chore: add PR note
e3c0460 merge: chore/T2601221047-skill-creator
14bed32 chore: add PR note
4c1edad chore: add skill-creator bundle
1258133 merge: feat/T2601221031-menu-sidebar

## Diff (spike/fullstack...HEAD)

 frontend/src/App.css | 133 ++-------------------------------------------------
 frontend/src/App.tsx |  66 -------------------------
 2 files changed, 3 insertions(+), 196 deletions(-)
