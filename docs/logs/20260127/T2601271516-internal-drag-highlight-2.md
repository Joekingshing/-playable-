# 简报：内部拖拽高亮抑制（加强）

- 分支：fix/T2601271516-internal-drag-highlight-2
- Worktree：E:\_wt\fix-T2601271516-internal-drag-highlight-2

## 变更内容
- 增加内部拖拽状态标识，确保 dragenter/dragover 不高亮。
- 外部文件判定保持 items 优先，types 退化。

## 验证记录
- (cd "E:\_wt\fix-T2601271516-internal-drag-highlight-2" && pnpm install)
- (cd "E:\_wt\fix-T2601271516-internal-drag-highlight-2\frontend" && pnpm build)

## 备注
- pnpm install 提示部分依赖 build scripts 被忽略（如需，执行 pnpm approve-builds）。
