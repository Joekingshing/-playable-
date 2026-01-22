# 简报：sidebar-drop-overlay

## 任务
- 调整侧边栏拖拽上传 overlay 显示与覆盖范围

## 变更
- frontend/src/App.tsx 增加拖拽文件检测与 overlay 显示逻辑
- frontend/src/App.css 新增侧边栏 overlay 样式并限定覆盖区域

## 验证
- (cd "E:\_wt\feat-sidebar-drop-overlay\frontend" && pnpm build)

## 备注
- 上传逻辑未变更
