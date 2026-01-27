# 简报：修复拖拽本地图片无法上传

- 分支：fix/T2601271205-drag-upload-guard
- Worktree：E:\_wt\fix-T2601271205-drag-upload-guard

## 问题原因
- dragenter/dragover 依赖 dataTransfer.files.length>0，但部分浏览器在拖拽过程中 files 为空，导致未 preventDefault，drop 不触发。

## 变更内容
- dragenter/dragover 仅使用 isFileDrag 判断，确保文件拖拽可激活 dropzone。
- drop 仍保留 files.length 检查，避免内部拖拽触发上传。

## 验证记录
- (cd "E:\_wt\fix-T2601271205-drag-upload-guard" && pnpm install)
- (cd "E:\_wt\fix-T2601271205-drag-upload-guard\frontend" && pnpm build)

## 备注
- pnpm install 提示部分依赖 build scripts 被忽略（如需，执行 pnpm approve-builds）。
