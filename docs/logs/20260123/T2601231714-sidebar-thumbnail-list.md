# 简报：sidebar-thumbnail-list

## 任务
- 左侧侧边栏预览区改为 PPT 风格单列缩略图列表

## 变更
- frontend/src/App.tsx 新增资产列表拉取、选中态与滚动控制
- frontend/src/App.css 添加缩略图卡片列表样式与选中态
- frontend/src/api/assets.ts 新增资产列表接口

## 验证
- (cd "E:\_wt\feat-sidebar-thumbnail-list\frontend" && pnpm build)

## 备注
- 列表按 mtime 升序展示，上传后自动选中新项
