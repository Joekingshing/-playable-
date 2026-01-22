# 简报：sidebar-upload-minimal

## 任务
- 左侧侧边栏固定布局
- 上传入口极简化，仅保留按钮与状态

## 变更
- rontend/src/App.tsx 移除标题/说明/提示文字，仅保留按钮与状态
- rontend/src/App.css 侧边栏固定宽度与极简上传样式

## 验证
- (cd "E:\\_wt\\feat-sidebar-upload-minimal/frontend" && pnpm build)

## 备注
- 拖拽上传与导出逻辑保持不变
