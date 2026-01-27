# 简报：内部拖拽不显示高亮

- 分支：fix/T2601271504-internal-drag-highlight
- Worktree：E:\_wt\fix-T2601271504-internal-drag-highlight

## 变更内容
- 内部拖拽优先识别并立即清除高亮。
- 高亮仅在外部文件拖拽时显示，使用 dragCounter 防止抖动。
- 外部判定优先 items.kind === 'file'，否则 files.length > 0。

## 验证记录
- (cd "E:\_wt\fix-T2601271504-internal-drag-highlight" && pnpm install)
- (cd "E:\_wt\fix-T2601271504-internal-drag-highlight\frontend" && pnpm build)

## 备注
- pnpm install 提示部分依赖 build scripts 被忽略（如需，执行 pnpm approve-builds）。
