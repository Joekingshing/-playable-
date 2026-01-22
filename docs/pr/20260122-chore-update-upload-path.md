# PR: chore/update-upload-path

## 变更摘要
- 更新上传图片默认保存目录为 E:\testfile。

## 影响范围
- 后端上传图片服务默认保存路径。

## 验证方式 / 结果
- (cd "$WT\backend" && pnpm build)
dd2c30a (HEAD -> chore/update-upload-path) chore: update default upload path
5ddda7b (spike/fullstack) merge: feat/ui-header-cleanup
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
3e8c4af chore: add PR note
1a1f13e fix(docs): load sidebar from docs
48001ba merge: chore/T2601221124-force-rebuild-sidebar
a94dc26 chore: add PR note
b8e63f6 merge: chore/T2601221120-refresh-sidebar
5b4c7c6 chore: add PR note
e3c0460 merge: chore/T2601221047-skill-creator

## Diff (spike/fullstack...HEAD)

 backend/apps/api/src/modules/upload/upload.service.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
