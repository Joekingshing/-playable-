# PR: fix/T2601271516-internal-drag-highlight-2

## 背景 / 目标
- 内部拖拽经过左侧栏仍会触发高亮，需彻底抑制。

## 变更摘要
- 增加内部拖拽状态标识，确保 dragenter/dragover 不再高亮。
- 外部文件判定保持 items 优先，types 退化。

## 影响范围
- 前端左侧栏拖拽高亮逻辑。

## 风险与回滚
- 风险：低，拖拽高亮判定调整。
- 回滚：移除 internalDragRef 相关逻辑。

## 验证方式 / 结果
- (cd "E:\_wt\fix-T2601271516-internal-drag-highlight-2" && pnpm install)
- (cd "E:\_wt\fix-T2601271516-internal-drag-highlight-2\frontend" && pnpm build)

## 关键 Diff（自检）
601a170 (HEAD -> fix/T2601271516-internal-drag-highlight-2) fix: suppress highlight for internal drags reliably
9ef96a2 (spike/fullstack) merge: chore/T2601271509-restart-preview
5d724c3 (chore/T2601271509-restart-preview) chore: add preview restart brief and PR note
701bd5c merge: fix/T2601271504-internal-drag-highlight
bf2131d chore: add PR note and brief
f9c879f fix: suppress highlight for internal drags
f670768 merge: chore/T2601271452-restart-preview
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

## Diff (spike/fullstack...HEAD)
 frontend/src/App.tsx | 15 +++++++++++++--
 1 file changed, 13 insertions(+), 2 deletions(-)
