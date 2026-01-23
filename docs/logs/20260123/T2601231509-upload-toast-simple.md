# 简报：upload-toast-simple

## 任务
- 上传提示改为仅在完成后显示成功/失败 Toast

## 变更
- frontend/src/App.tsx 移除上传进度 Toast，仅保留成功/失败提示
- frontend/src/App.css 简化 Toast 样式并文本居中

## 验证
- (cd "E:\_wt\feat-upload-toast-simple\frontend" && pnpm build)

## 备注
- 上传逻辑未变更
