# 简报 2026-01-21 16:18

## 已实现功能
- 前端新增顶部工具条（项目名/保存/导出），导出按钮支持加载态
- 点击“导出”调用后端 /export，浏览器直接下载 zip
- 导出文件名按时间戳生成，打包目录为 E:\playable\playable-phaser
- 导出打包排除 
ode_modules

## 项目改动
- 后端新增 export 模块（Controller/Service/Module），使用 rchiver 流式打包
- 前端新增导出下载 API 与按钮交互
- Vite 代理 /api 增加 rewrite，转发到后端根路径
- AGENTS.md 更新端口占用的启动要求
