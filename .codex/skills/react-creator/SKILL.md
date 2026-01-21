---
name: react-creator
description: 创建固定框架的 React + Phaser 3 最小可运行代码包，严格按指定 src 结构与目录说明生成。用于用户提出“创建phaser引擎代码包 / 可玩性广告代码包 / playable代码包”等需求。
---

# React Creator

## Overview

生成一个最小可运行的 React + Phaser 3 + TypeScript + Vite 项目，输出到工作区根目录 `playable-phaser`，并严格按 `references/src-structure.md` 的结构创建 `src` 目录与文件。

## Workflow

1. 读取 `references/src-structure.md`，确认 `src` 目录结构与职责说明；读取 `references/src-structure.json` 作为结构校验基准。
2. 在工作区根目录创建 `playable-phaser`，初始化最小可运行项目（Vite React TS + Phaser 3）。
3. 按结构创建目录与文件：`src/game/`、`src/game/scenes/`、`src/game/components/`、`src/assets/`、`src/config/`、`src/game/EventBus.ts`。
4. 在 `src` 下每个目录放置 `README.md`，描述该目录用途；如包含子目录，在 `README.md` 中逐一说明子目录用途。
5. 运行 `scripts/verify_structure.py` 校验结构与 `README.md` 完整性，修正后再交付。

## Output Requirements

- 产物路径：工作区根目录 `playable-phaser`
- 运行要求：安装依赖后可通过 `pnpm dev` 或 `npm run dev` 启动
- 结构要求：`src` 与 `references/src-structure.md` 完全一致
- 文档要求：`src` 下每个目录必须有 `README.md`

## Minimal Runtime Checklist

- `package.json` 包含 `react`、`react-dom`、`phaser`、`vite`、`@vitejs/plugin-react`、`typescript`
- `index.html` 提供挂载点
- `src/main.tsx` 渲染 React 根组件
- `src/App.tsx`（或等效入口）包含 Phaser 挂载容器
- `src/config/` 提供 Phaser 配置
- `src/game/` 至少包含一个 Scene，确保游戏实例可创建与销毁
- `src/game/EventBus.ts` 提供事件系统（可基于 `Phaser.Events.EventEmitter`）

## Resources

- `references/src-structure.md`：目录结构与职责说明
- `references/src-structure.json`：目录结构校验规范
- `scripts/verify_structure.py`：结构与 `README.md` 校验脚本
