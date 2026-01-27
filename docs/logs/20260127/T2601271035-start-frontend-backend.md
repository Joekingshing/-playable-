# 简报：启动前后端开发服务

- 任务分支：chore/T2601271035-start-frontend-backend
- Worktree：E:\_wt\chore-T2601271035-start-frontend-backend

## 执行内容
- 安装依赖：pnpm install（workspace）
- 启动后端：pnpm start:dev（端口 6100）
- 启动前端：pnpm dev（端口 8000）

## 验证记录
- 端口监听：6100/8000 已 LISTENING
- 前端访问：http://localhost:8000
- 后端访问：http://localhost:6100

## 进程信息
- 后端监听 PID：30728
- 前端监听 PID：32928

## 备注 / 风险
- pnpm install 提示部分依赖 build scripts 被忽略（如需，执行 pnpm approve-builds）。
