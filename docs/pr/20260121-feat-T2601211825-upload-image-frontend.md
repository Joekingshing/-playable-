# PR: feat/T2601211825-upload-image-frontend

## 背景 / 目标
- 前端对接图片上传接口，上传文件至后端保存目录。

## 变更摘要
- 新增 upload API 封装，使用 XHR 上报进度。
- 上传 UI 调用后端接口并展示结果。

## 影响范围
- frontend/src

## 风险与回滚
- 风险：网络异常或后端不可用时提示上传失败。
- 回滚：回退本分支提交。

## 验证方式 / 结果
- pnpm build（frontend）：通过
3a42724 (HEAD -> feat/T2601211825-upload-image-frontend) feat: connect image upload api
6f0ebda (fullstack) merge: feat/T2509162207-upload-image
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
17df594 chore: change api port to 6100
9d2b48d merge: fix/T2601211658-clean-app-css
f9051fa chore: add PR note

## Diff (fullstack...HEAD)

 frontend/src/App.tsx       | 43 ++++++++++++++------------
 frontend/src/api/client.ts |  2 +-
 frontend/src/api/upload.ts | 77 ++++++++++++++++++++++++++++++++++++++++++++++
 3 files changed, 101 insertions(+), 21 deletions(-)
