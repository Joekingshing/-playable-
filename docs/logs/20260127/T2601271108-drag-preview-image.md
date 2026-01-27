# 简报：缩略图拖拽预览改为自定义 drag image

- 分支：fix/T2601271108-drag-preview-image
- Worktree：E:\_wt\fix-T2601271108-drag-preview-image

## 变更内容
- 拖拽开始时创建离屏 <img> 并调用 setDragImage。
- 预览尺寸按自然尺寸等比缩放（最大边长 200px，不放大小图）。

## 影响范围
- 前端缩略图拖拽预览效果。

## 验证记录
- (cd "E:\_wt\fix-T2601271108-drag-preview-image\frontend" && pnpm build)
  - 首次失败：node_modules 缺失，tsc 找不到
  - 执行 (cd "E:\_wt\fix-T2601271108-drag-preview-image" && pnpm install) 后成功

## 备注
- pnpm install 提示部分依赖 build scripts 被忽略（如需，执行 pnpm approve-builds）。
