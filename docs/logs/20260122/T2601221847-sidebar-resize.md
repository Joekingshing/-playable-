# 简报：sidebar-resize

## 任务
- 左侧侧边栏增加拖拽手柄并支持宽度调整

## 变更
- frontend/src/App.tsx 增加拖拽逻辑与宽度状态
- frontend/src/App.css 添加手柄样式、拖拽阴影与禁止选中

## 验证
- (cd "E:\_wt\feat-sidebar-resize\frontend" && pnpm build)

## 备注
- 顶部工具条与导出逻辑未变更
