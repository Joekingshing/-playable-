# PR: feat/sidebar-add-bar

## 变更摘要
- 侧边栏顶部移除上传按钮
- 底部新增“添加图片”横条入口（悬停提示 + 点击选择）

## 影响范围
- rontend/src/App.tsx
- rontend/src/App.css
- docs/logs/20260122/T2601221727-sidebar-add-bar.md

## 验证方式 / 结果
- (cd "E:\\_wt\\feat-sidebar-add-bar/frontend" && pnpm build)

## 关键 Diff（自检）
0a96522 (HEAD -> feat/sidebar-add-bar) feat: move upload trigger to sidebar footer
0fcc636 (spike/fullstack, chore/preview-ui-minimal) merge: feat/sidebar-upload-minimal
38b0ef2 chore: add sidebar minimal brief
58378be feat: simplify sidebar upload
d1aeb5f (chore/preview-ui-current) merge: feat/sidebar-upload-layout
4cbc939 chore: add sidebar upload brief
94607a6 feat: move upload to sidebar
98e1c27 (origin/spike/fullstack, chore/preview-ui-latest) merge: chore/remove-report-dir
0fc6da3 chore: add report removal brief
1a13906 chore: remove report directory
a2420e5 merge: fix/chinese-filename-garbled
24006c6 chore: add pr note for filename fix
2bd7169 fix: normalize upload filename encoding
c2401f3 merge: chore/preview-ui
5f973d6 (chore/preview-ui) chore: add pr review note for brief
8a8eb61 chore: add ui header cleanup brief
ce8c72b merge: chore/update-upload-path (pr note)
12674b3 chore: add pr review note
e755ddb merge: chore/update-upload-path
dd2c30a chore: update default upload path

## Diff (spike/fullstack...HEAD)

 frontend/src/App.css | 36 ++++++++++++++++++++++++++++++++----
 frontend/src/App.tsx | 44 ++++++++++++++++++++++++--------------------
 2 files changed, 56 insertions(+), 24 deletions(-)
