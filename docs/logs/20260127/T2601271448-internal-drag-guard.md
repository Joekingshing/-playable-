# 简报：内部拖拽不触发上传

- 分支：fix/T2601271448-internal-drag-guard
- Worktree：E:\_wt\fix-T2601271448-internal-drag-guard

## 变更内容
- 缩略图拖拽写入 application/x-asset 标识。
- drop 优先识别内部拖拽并阻止上传。
- 高亮仅在外部文件拖拽时显示。
- 仅当存在文件且类型/后缀符合 png/jpg/jpeg/webp 才上传。

## 验证记录
- (cd "E:\_wt\fix-T2601271448-internal-drag-guard" && pnpm install)
- (cd "E:\_wt\fix-T2601271448-internal-drag-guard\frontend" && pnpm build)

## 备注
- pnpm install 提示部分依赖 build scripts 被忽略（如需，执行 pnpm approve-builds）。
