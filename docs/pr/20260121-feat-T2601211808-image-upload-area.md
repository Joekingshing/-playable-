# PR: feat/T2601211808-image-upload-area

## 背景 / 目标
- 在首页工具条下方新增图片上传区域，支持选择与拖拽，并提供上传状态提示。

## 变更摘要
- 新增图片上传交互与状态管理。
- 添加上传区域样式，不影响现有导出与页面布局。

## 影响范围
- frontend/src/App.tsx
- frontend/src/App.css

## 风险与回滚
- 风险低：前端 UI 增量。
- 回滚方式：回退提交 b1486bd。

## 验证方式 / 结果
- (cd "E:\_wt\feat-T2601211808-image-upload-area" && pnpm install)
- (cd "E:\_wt\feat-T2601211808-image-upload-area/frontend" && pnpm build)

## 关键 Diff（自检）
b1486bd (HEAD -> feat/T2601211808-image-upload-area) feat: add image upload area
375c9d8 (fullstack, feat/T2509162207-upload-image) merge: fix/T2601211707-revert-frontend-backend
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
4b24798 chore: remove unused app styles
0faf874 merge: fix/T2601211652-remove-home-hero
66e5260 chore: add PR note
fa548dd fix: remove home template content
46038dd merge: chore/T2601211643-api-port-6000
d1933e3 Merge branch 'fullstack' into chore/T2601211643-api-port-6000
5531b9a chore: add PR note

## Diff (fullstack...HEAD)

 frontend/src/App.css | 102 +++++++++++++++++++++++++++++++
 frontend/src/App.tsx | 168 ++++++++++++++++++++++++++++++++++++++++++++++++++-
 2 files changed, 269 insertions(+), 1 deletion(-)
