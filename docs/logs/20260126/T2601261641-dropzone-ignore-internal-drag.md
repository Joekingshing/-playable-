# 简报：dropzone-ignore-internal-drag

## 任务
- 修复内部拖拽触发上传的问题

## 变更
- frontend/src/App.tsx 仅在 dataTransfer.files.length > 0 时处理拖拽/上传

## 验证
- (cd "E:\_wt\fix-dropzone-ignore-internal-drag\frontend" && pnpm build)

## 备注
- 不影响正常文件拖拽上传
