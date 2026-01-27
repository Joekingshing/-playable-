# PR: fix/T2601271504-internal-drag-highlight

## 背景 / 目标
- 内部拖拽经过左侧栏时不应触发灰色高亮。

## 变更摘要
- 内部拖拽优先识别并立即清除高亮。
- 高亮仅对外部文件拖拽生效，使用 dragCounter 稳定显示。

## 影响范围
- 前端左侧栏拖拽上传高亮提示。

## 风险与回滚
- 风险：低，拖拽高亮判定调整。
- 回滚：恢复原 dragenter/leave 逻辑。

## 验证方式 / 结果
- (cd "E:\_wt\fix-T2601271504-internal-drag-highlight" && pnpm install)
- (cd "E:\_wt\fix-T2601271504-internal-drag-highlight\frontend" && pnpm build)

## 关键 Diff（自检）
f9c879f (HEAD -> fix/T2601271504-internal-drag-highlight) fix: suppress highlight for internal drags
f670768 (spike/fullstack) merge: chore/T2601271452-restart-preview
1d3c8a3 (chore/T2601271452-restart-preview) chore: add preview restart brief and PR note
caa96c8 merge: fix/T2601271448-internal-drag-guard
4c8c5ae chore: add PR note and brief
3ca8347 fix: prevent internal drag from triggering upload
8c61605 merge: chore/T2601271404-restart-preview
41c7f00 (chore/T2601271404-restart-preview) chore: add preview restart brief and PR note
b31be50 merge: fix/T2601271401-drag-preview-sync
5790753 chore: add PR note and brief
1cdd0e3 fix: preload drag image sizes for preview
ad77eb9 merge: chore/T2601271214-restart-preview
5afeb26 (chore/T2601271214-restart-preview) chore: add preview restart brief and PR note
6051f88 merge: fix/T2601271205-drag-upload-guard
73ab1b2 chore: add PR note and brief
0d3dad8 fix: allow file drags to activate dropzone
020e4e0 merge: chore/T2601271115-restart-preview
a341b44 (chore/T2601271115-restart-preview) chore: add preview restart brief and PR note
5e29c7b merge: fix/T2601271108-drag-preview-image
762045e chore: add PR note and brief

## Diff (spike/fullstack...HEAD)
 frontend/src/App.tsx | 23 ++++++++++++++++++-----
 1 file changed, 18 insertions(+), 5 deletions(-)
