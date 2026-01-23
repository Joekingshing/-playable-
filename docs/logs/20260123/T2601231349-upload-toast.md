# 简报：upload-toast

## 任务
- 上传提示改为顶部居中 Toast 展示，侧边栏不再显示进度/结果

## 变更
- frontend/src/App.tsx 增加 Toast 队列与上传状态同步
- frontend/src/App.css 添加 Toast 样式并移除侧边栏反馈样式

## 验证
- (cd "E:\_wt\feat-upload-toast\frontend" && pnpm build)

## 备注
- 上传逻辑与导出功能未变更
