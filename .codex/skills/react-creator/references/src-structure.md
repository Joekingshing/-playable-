# src 结构与职责

来源：E:\ten_pair\ten_pair\docs\251031-消除露出背景\design\sections\1-project-overview.md

原始结构：

```
src/
├── game/
│   ├── scenes/         # 游戏场景
│   ├── components/     # 游戏组件
│   └── EventBus.ts     # 事件系统
├── assets/            # 资源文件
└── config/           # 配置文件
```

职责说明：

- src/：源代码根目录
- src/game/：Phaser 游戏逻辑
- src/game/scenes/：游戏场景
- src/game/components/：游戏组件
- src/game/EventBus.ts：事件系统
- src/assets/：资源文件
- src/config/：配置文件
