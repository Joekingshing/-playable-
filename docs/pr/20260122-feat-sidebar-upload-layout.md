# PR: feat/sidebar-upload-layout

## 变更摘要
- 顶部工具条全宽吸顶，新增左侧边栏布局
- 上传入口迁移至侧边栏，主内容区位于右侧

## 影响范围
- rontend/src/App.tsx
- rontend/src/App.css
- docs/logs/20260122/T2601221601-sidebar-upload-layout.md

## 验证方式 / 结果
- (cd "E:\\_wt\\feat-sidebar-upload-layout/frontend" && pnpm build)

## 关键 Diff（自检）
94607a6 (HEAD -> feat/sidebar-upload-layout) feat: move upload to sidebar
98e1c27 (origin/spike/fullstack, spike/fullstack, chore/preview-ui-latest) merge: chore/remove-report-dir
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
b78d07b chore: update docs sidebar and configs
0061806 chore(docs): fix docsify paths
cffb24c merge: fix/T2601221138-sidebar-relative-path

## Diff (spike/fullstack...HEAD)

 frontend/src/App.css |  36 +++++++++++----
 frontend/src/App.tsx | 127 ++++++++++++++++++++++++++-------------------------
 2 files changed, 92 insertions(+), 71 deletions(-)
