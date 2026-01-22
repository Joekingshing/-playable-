# PR: feat/sidebar-upload-minimal

## 变更摘要
- 左侧侧边栏固定宽度，主内容区自适应
- 上传入口极简化，仅保留按钮与状态提示

## 影响范围
- rontend/src/App.tsx
- rontend/src/App.css
- docs/logs/20260122/T2601221649-sidebar-upload-minimal.md

## 验证方式 / 结果
- (cd "E:\\_wt\\feat-sidebar-upload-minimal/frontend" && pnpm build)

## 关键 Diff（自检）
58378be (HEAD -> feat/sidebar-upload-minimal) feat: simplify sidebar upload
d1aeb5f (spike/fullstack, chore/preview-ui-current) merge: feat/sidebar-upload-layout
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
5ddda7b merge: feat/ui-header-cleanup
64bc36d chore: add pr review note
3ad69b0 feat: simplify editor header layout

## Diff (spike/fullstack...HEAD)

 frontend/src/App.css | 65 +++++++++++++++++++++++-----------------------------
 frontend/src/App.tsx |  9 +-------
 2 files changed, 30 insertions(+), 44 deletions(-)
