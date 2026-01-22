# 简报：ui-header-cleanup

## 任务
- 前端 UI 清理与吸顶 Header 调整（仅 UI，不改后端/导出链路）

## 变更
- 移除首页模板示例内容与 Users 列表卡片
- 顶部工具条改为全宽吸顶 Header，内容对齐页面左右 padding
- 保留图片上传区域并位于 Header 下方

## 验证
- (cd "E:\\_wt\\feat-ui-header-cleanup\\frontend" && pnpm build)

## 预览
- 前端：http://localhost:8000
- 后端：http://localhost:6100

## 风险与备注
- 无功能逻辑改动，仅 UI 调整
