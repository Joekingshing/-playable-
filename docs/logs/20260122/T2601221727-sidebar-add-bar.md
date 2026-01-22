# 简报：sidebar-add-bar

## 任务
- 侧边栏顶部移除上传按钮
- 底部新增“添加图片”横条入口，支持点击选择与拖拽上传

## 变更
- rontend/src/App.tsx 将上传入口移至侧边栏底部横条
- rontend/src/App.css 新增底部横条样式并移除顶部按钮样式

## 验证
- (cd "E:\\_wt\\feat-sidebar-add-bar/frontend" && pnpm build)

## 备注
- 上传逻辑未变更
