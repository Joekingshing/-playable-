# PR: fix/chinese-filename-garbled

## 变更摘要
- 修复上传文件名的编码归一化，避免中文/UTF-8 变成乱码

## 影响范围
- backend/apps/api/src/modules/upload/upload.service.ts

## 验证方式 / 结果
- (cd "$WT/backend" && pnpm build)

## 关键 Diff（自检）
2bd7169 (HEAD -> fix/chinese-filename-garbled) fix: normalize upload filename encoding
c2401f3 (spike/fullstack) merge: chore/preview-ui
5f973d6 (chore/preview-ui) chore: add pr review note for brief
8a8eb61 chore: add ui header cleanup brief
ce8c72b merge: chore/update-upload-path (pr note)
12674b3 chore: add pr review note
e755ddb merge: chore/update-upload-path
dd2c30a chore: update default upload path
5ddda7b merge: feat/ui-header-cleanup
64bc36d chore: add pr review note
3ad69b0 feat: simplify editor header layout
b78d07b (origin/spike/fullstack, chore/start-frontend-backend) chore: update docs sidebar and configs
0061806 chore(docs): fix docsify paths
cffb24c merge: fix/T2601221138-sidebar-relative-path
bc2e26a chore: add PR note
b965e3a fix(docs): disable docsify relativePath
98ba0ac merge: fix/T2601221130-sidebar-empty
dc227a0 chore: add PR note
a241ae9 fix(docs): load sidebar with absolute paths
e718abc merge: fix/T2601221128-sidebar-path

## Diff (spike/fullstack...HEAD)

 backend/apps/api/src/modules/upload/upload.service.ts | 13 ++++++++++++-
 1 file changed, 12 insertions(+), 1 deletion(-)
