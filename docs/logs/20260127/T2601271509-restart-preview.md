# 简报：重启前后端预览

- 任务分支：chore/T2601271509-restart-preview
- Worktree：E:\_wt\chore-T2601271509-restart-preview

## 执行内容
- 释放端口：8000/6100
- 安装依赖：pnpm install（workspace）
- 启动后端：pnpm start:dev（端口 6100）
- 启动前端：pnpm dev（端口 8000）

## 验证记录
- 端口监听：8000/6100 已 LISTENING
- 前端访问：http://localhost:8000
- 后端访问：http://localhost:6100

## 进程信息
- 后端监听 PID：40400
- 前端监听 PID：37524

## 备注 / 风险
- pnpm install 提示部分依赖 build scripts 被忽略（如需，执行 pnpm approve-builds）。
