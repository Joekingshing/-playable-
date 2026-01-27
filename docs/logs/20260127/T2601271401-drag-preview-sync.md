# 简报：拖拽预览同步自定义 drag image

- 分支：fix/T2601271401-drag-preview-sync
- Worktree：E:\_wt\fix-T2601271401-drag-preview-sync

## 变更内容
- 拖拽开始同步 setDragImage，使用离屏 <img> 且不透明。
- 预加载图片尺寸，尺寸未知时用 160px fallback。
- 预览尺寸按 maxSide=200 等比缩放。

## 影响范围
- 前端左侧缩略图拖拽预览效果。

## 验证记录
- (cd "E:\_wt\fix-T2601271401-drag-preview-sync" && pnpm install)
- (cd "E:\_wt\fix-T2601271401-drag-preview-sync\frontend" && pnpm build)

## 备注
- pnpm install 提示部分依赖 build scripts 被忽略（如需，执行 pnpm approve-builds）。
