# Worktree Instructions (worktree_break)

This file is the single source of truth for where and how to work.

## Identity
- Worktree root: E:\_wt\worktree_break
- Working branch: worktree_break
- Base branch: fullstack
- Console repo root: E:\playable (read-only; do not write here)

## Non-negotiable rules
- All write operations MUST happen under E:\_wt\worktree_break.
- Do NOT run install/build/test/codegen in E:\playable.
- Each console must verify location + branch before running commands.
- If the location/branch is wrong, stop immediately and fix it.

## Required pre-check (run this in every console)
```powershell
$WT="E:\_wt\worktree_break"
Set-Location -Path $WT
Get-Location
git branch --show-current
```
Expected output:
- Path: E:\_wt\worktree_break
- Branch: worktree_break

## Safe command patterns (always explicit)
```powershell
git -C "E:\_wt\worktree_break" status -sb
pnpm -C "E:\_wt\worktree_break" install
pnpm -C "E:\_wt\worktree_break\frontend" dev
pnpm -C "E:\_wt\worktree_break\backend" start:dev api
just --working-directory "E:\_wt\worktree_break" dev app=api
```

## Playable phaser app
This folder is not in the pnpm workspace, so use ignore-workspace for installs/dev.
```powershell
pnpm -C "E:\_wt\worktree_break\playable-phaser" install --ignore-workspace
pnpm -C "E:\_wt\worktree_break\playable-phaser" dev --ignore-workspace
```

## Default dev ports
- Frontend (Vite): http://localhost:8000
- Backend (NestJS): http://localhost:6100/health
- Playable Phaser: http://localhost:7000

## If something is wrong
- Wrong directory:
  ```powershell
  Set-Location -Path E:\_wt\worktree_break
  ```
- Wrong branch:
  ```powershell
  git -C "E:\_wt\worktree_break" switch worktree_break
  ```

## Stop running processes (example)
```powershell
Stop-Process -Id <PID> -Force
```

## Commit rule
Commit only in this worktree. Do not commit or modify files in E:\playable.
