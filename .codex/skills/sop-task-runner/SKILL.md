---
name: sop-task-runner
description: >
  通用任务执行 Skill：严格按 Git Worktree 任务开发 SOP（本地合并版｜统一基线：spike/fullstack）执行任意功能开发/优化/重构/Bug 修复/问题排查：
  预检 → 创建 worktree → 定位/方案 → 实现 → 自测验证 → 生成本地 PR 审阅单 → 合并回 spike/fullstack → 清理，并严格做到“控制台目录零写入”。
license: MIT
compatibility:
  required:
    - git>=2.35
    - powershell>=5.1
    - windows
  assumes:
    - repository has branch: spike/fullstack
    - worktree root is: ../_wt/
metadata:
  version: 1.0.0
  language: zh-CN
  tags:
    - git-worktree
    - sop
    - local-merge
    - task-runner
    - audit
---

# 通用 SOP 任务执行 Skill（Worktree + 本地合并）

## 使用场景

当你要在本仓库执行任意类型任务时使用本 Skill，包括但不限于：

- 功能开发 / 代码优化 / 重构 / Bug 修复
- 性能优化 / 稳定性增强 / 兼容性修复
- 文档更新 / 配置调整
- 问题排查（需要打点/改代码/验证的那种）

本 Skill 强制要求遵守仓库内 SOP（例如 `git-worktree-sop.md`）：
- **控制台目录零写入**
- **worktree 隔离开发**
- **生成本地 PR 审阅单**
- **本地合并回 spike/fullstack**

---

## 输入（你交给 agent 的内容）

- 用户仅输入：任务描述（必填）
- 系统生成：TID=`T<yymmddHHMM>`（同分钟冲突追加 `-01/-02...`）
- 系统判定：分支类型（`fix/` > `feat/` > `chore/`）
- 分支名：`$BR=<branchType><TID>-<slug>`（slug=任务描述提取 3~6 关键词，`-` 连接）
- 审阅单：`docs/pr/<yyyymmdd>-<BR>.md`
- 自测：按项目约定执行（用户不填写/不覆盖）

---

## 强制约束（零容忍）

> **控制台目录（repo root）零写入**：不允许在 repo root 发生任何文件变更/生成/格式化/删除/新增。  
> 所有开发改动与会写入的命令（test/build/install/lint fix/codegen/formatter）只能在 worktree 中执行。

任何违反将导致任务**不合规**，变更**不得合并**，必须回滚并按 SOP 重做。

---

# 执行流程

> 每个步骤都明确标注**在哪里执行**：
> - **控制台目录（Console Workspace）**：repo root
> - **任务 Worktree（Dev Worktree）**：`../_wt/<branch>`
> - 本文档命令示例为 PowerShell 版本（Windows）；如在其他 shell 使用，请按等价命令替换。

## 0) 预检（控制台目录执行）

1) 确保在 repo root（控制台目录）。

2) 切到唯一集成基线：

```powershell
git switch spike/fullstack
```

3. 确保控制台目录 clean（硬门槛）：

```powershell
git status
```

> 若非 clean：立即进入“应急处理：控制台目录变脏”（见文末），恢复 clean 后再继续。

4. 查看 worktree 列表（防撞）：

```powershell
git worktree list
```

---

## 1) 解析任务并生成分支名（控制台目录执行）

从输入中提取：

* 分支类型：`feat`/`fix`/`chore`/`refactor`
* ticket：如 `T123`（没有就用 `NO-TICKET` 或短描述）
* 简短描述：kebab-case（例如 `upload-retry` / `cache-fix` / `docs-cleanup`）

分支命名规则（推荐）：

* `feat/<ticket>-<desc>`
* `fix/<ticket>-<desc>`
* `refactor/<ticket>-<desc>`
* `chore/<desc>`

示例：`fix/T123-upload-retry`

---

## 2) 创建任务 worktree（控制台目录执行）

```powershell
$BR = "fix/T123-upload-retry"
$WT = Join-Path "..\_wt" ($BR -replace "/", "-")

# 硬门槛：控制台必须 clean
git status

# 只允许从 spike/fullstack 拉分支创建 worktree
git worktree add -b $BR $WT spike/fullstack

# 进入 worktree 开发（示例：显式指定工作目录）
# git -C $WT status
```
* **进入 worktree 后必须校验分支**：执行 `git branch --show-current`，结果必须等于 `$BR`。
* **硬门槛**：若当前目录不等于 `$WT` **或** 当前分支不等于 `$BR`，则立刻停止执行（退出/报错），**禁止进入下一步**。


---

## 3) 定位与复现（在任务 worktree 执行）

目标：把“问题/需求”落到可操作的代码入口与复现路径。

* 读相关文档/设计（若存在）：`docs/**`
* 找代码入口：路由/页面/组件/service/任务脚本/配置项等
* 如果是 Bug：给出**最小复现步骤**与**预期 vs 实际**
* 输出定位结论（写进 PR 审阅单也可以）：

  * 触发路径（入口文件/函数）
  * 关键数据流（输入/输出/状态）
  * 可能的根因候选（按概率排序）

> 如果定位阶段发现“文档定位地图”过时：在 worktree 内同步更新对应 docs（不要在控制台改）。

---

## 4) 方案设计（在任务 worktree 执行）

在编码前形成可执行方案（建议写进 PR 审阅单）：

* 改动范围：哪些模块/文件会动，哪些不动
* 边界与分层：UI / 业务 / 数据 / 基础设施（按项目实际）
* 兼容性：是否影响现有接口/配置/数据结构
* 风险与回滚：如何小步提交、如何回退
* 验证计划：每一步要怎么验证（单测/集成/手动/日志）

---

## 5) 实现（在任务 worktree 执行，小步提交）

```powershell
git status
# 修改代码/文档
git add -A
git commit -m "fix: xxx"
```

建议：

* 每个 commit 能独立解释：做了什么 / 为什么 / 影响面
* 先小改动验证，再逐步扩大；避免“大一把梭”
* 如需格式化/codegen/依赖安装：**只在 worktree 执行**

---

## 6) 自测与验证（必须在任务 worktree 执行）

按输入的“验证方式”执行（示例）：

```powershell
# pnpm test
# pnpm lint
# pnpm build
# go test ./...
# cargo test
```

记录到 PR 审阅单：

* 跑了什么命令
* 结果（通过/失败）
* 若失败：失败原因与风险评估（是否可接受、如何规避）

---

## 7) 生成本地 PR 审阅单（必须在任务 worktree 执行）

```powershell
if (-not $BR) {
  $BR = git branch --show-current
}

New-Item -ItemType Directory -Path "docs/pr" -Force | Out-Null
$PR_NOTE = "docs/pr/{0}-{1}.md" -f (Get-Date -Format "yyyyMMdd"), ($BR -replace "/", "-")

@"
# PR: $BR

## 背景 / 目标
-

## 变更摘要
-

## 影响范围
-

## 风险与回滚
-

## 验证方式 / 结果
-

## 关键 Diff（自检）
"@ | Set-Content -Path $PR_NOTE

git --no-pager log --oneline --decorate -n 20 | Add-Content -Path $PR_NOTE
Add-Content -Path $PR_NOTE -Value "`n## Diff (spike/fullstack...HEAD)`n"
git --no-pager diff --stat spike/fullstack...HEAD | Add-Content -Path $PR_NOTE

git add $PR_NOTE
git commit -m "chore: add PR note"
```

最低要求：

* `docs/pr/<yyyymmdd>-<branch>.md` 必须存在并提交
* 至少填写：**背景/目标、变更摘要、影响范围、验证方式/结果**

---

## 8) 合并前同步基线，消灭冲突（在任务 worktree 执行）

```powershell
git fetch --all --prune
git merge spike/fullstack
# 如有冲突：在 worktree 中解决 → add → commit
```

同步后建议再跑一次关键自测，并更新审阅单“验证结果”。

---

## 9) 本地合并回 spike/fullstack（控制台目录执行）

回到 repo root（控制台目录）：

```powershell
# 回到 repo root（控制台目录）后执行
git switch spike/fullstack

# 硬门槛：控制台必须 clean
git status

git merge --no-ff "$BR" -m "merge: $BR"

# 合并结束必须 clean
git status
```

> 合并态需要验证的话：仍必须在 worktree 中执行。
> （可额外创建 verify worktree 来验证合并态。）

---

## 10) 清理 worktree（控制台目录执行）

```powershell
$WT = Join-Path "..\_wt" ($BR -replace "/", "-")

git worktree remove $WT
git worktree prune
git branch -d $BR
```

---

# 应急处理：控制台目录变脏（必须先恢复 clean）

只允许为“恢复 clean”而在控制台执行 `stash` / `clean`：

```powershell
git stash push -u -m "console-dirty: <原因简述>"
git status
```

若仍不 clean 且确定剩余是可删 ignored 产物：

```powershell
git clean -fdX
git status
```

如 stash 内容需要交付：必须迁移到 worktree 后再提交，禁止在控制台继续开发或直接 commit。

---
可以，给你一版**极简条款**（统一 `$WT`，不依赖 `cd`）：

---

## 所有写操作必须显式落到 `$WT`

1. **凡是会动文件/目录的命令**（新增/修改/删除/拷贝/移动/生成产物/安装依赖/格式化/codegen/构建/测试写缓存等），**必须显式作用在 `$WT`**：

* 文件路径必须以 `$WT` 开头（如 `New-Item -ItemType Directory -Path "$WT\src\foo" -Force`、`Copy-Item a "$WT\..."`）。
* 或命令显式在 `$WT` 目录执行：`git -C "$WT" ...` / `& { Set-Location -Path $WT; <cmd> }`。

2. **Git 操作统一写法**：除“合并回 spike/fullstack / 清理 worktree”外，全部用：

```powershell
git -C "$WT" <subcommand>
```

3. **控制台目录（repo root）零写入**：

* 禁止出现任何不带 `$WT` 前缀的写路径（如 `src/...`、`docs/...`、`./...`）。
* 在控制台目录只允许只读检查 + 合并/清理；其它一律视为不合规。

4. **硬门槛**：若 `$WT` 不存在 **或** `git -C "$WT" branch --show-current` ≠ `$BR`，**立即停止，禁止进入下一步**。

---


# Definition of Done（审计口径）

完成并允许合并的最低标准：

* [ ] 分支从 `spike/fullstack` 创建
* [ ] 一个任务 = 一个分支 = 一个 worktree
* [ ] 所有改动都发生在 worktree 中，控制台目录长期 clean
* [ ] 自测/构建/安装依赖等只在 worktree 执行且结果已记录
* [ ] 生成并提交 `docs/pr/<yyyymmdd>-<branch>.md`
* [ ] 在控制台目录 `--no-ff` 合并回 `spike/fullstack`
* [ ] 合并后控制台目录 `git status` 为 clean
* [ ] 清理 worktree + prune + 删除任务分支

 
