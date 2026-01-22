#!/usr/bin/env python3
import argparse
import json
import os
import subprocess
import sys
from typing import Optional

DEFAULT_DOCS_DIR = "docs"
DEFAULT_OUTPUT_FILE = os.path.join(DEFAULT_DOCS_DIR, "_sidebar.md")
DEFAULT_MENU_FILE = os.path.join(DEFAULT_DOCS_DIR, "menu.json")
# 文档位于 /docs/ 子目录时使用 "/docs/"；若部署在 GitHub Pages 项目页（https://user.github.io/your-repo/），改为 "/your-repo/"
BASE_PREFIX = "/docs/"

IGNORE_FILES = {"_sidebar.md", "index.html", ".nojekyll", "menu.json"}
IGNORE_DIRS = {".git", "__pycache__", ".DS_Store"}

def sort_key(name: str):
    base = os.path.splitext(name)[0]
    parts = base.split("-", 1)
    head = parts[0]
    if head.isdigit():
        num = int(head)
        text = parts[1] if len(parts) > 1 else head
        return (num, text.lower())
    if len(head) > 1 and head[0] in ("T", "t") and head[1:].isdigit():
        # T+日期文件：按完整文件名排序
        return (999, base.lower())
    text = parts[1] if len(parts) > 1 else head
    return (999, text.lower())

def list_sorted(full_dir: str):
    items = [e for e in os.listdir(full_dir) if e not in IGNORE_DIRS and not e.startswith(".")]
    dirs = [e for e in items if os.path.isdir(os.path.join(full_dir, e))]
    files = [e for e in items if os.path.isfile(os.path.join(full_dir, e)) and e.endswith(".md") and e not in IGNORE_FILES]
    return sorted(dirs, key=sort_key), sorted(files, key=sort_key)

def human_title(name: str) -> str:
    return name.replace("-", " ").replace("_", " ").title()

def abs_href(path_from_docs_root: str, is_dir: bool = False) -> str:
    path = path_from_docs_root.replace(os.sep, "/").lstrip("/")
    if is_dir and not path.endswith("/"):
        path += "/"
    if BASE_PREFIX == "/":
        return "/" + path
    return (BASE_PREFIX.rstrip("/") + "/" + path).replace("//", "/")

def has_readme(full_dir: str) -> bool:
    return os.path.exists(os.path.join(full_dir, "README.md"))

def is_external_link(link: str) -> bool:
    return link.startswith("http://") or link.startswith("https://")

def normalize_menu_link(link: str) -> str:
    cleaned = link.strip().replace("\\", "/")
    if cleaned.startswith("./"):
        cleaned = cleaned[2:]
    if cleaned.startswith("docs/"):
        cleaned = cleaned[5:]
    return cleaned

def resolve_menu_href(link: str, docs_dir: str, is_dir: Optional[bool]) -> str:
    if is_external_link(link):
        return link

    cleaned = normalize_menu_link(link)
    if cleaned in ("", "/"):
        return abs_href("", is_dir=True)

    inferred_dir = cleaned.endswith("/")
    cleaned = cleaned.strip("/")
    if is_dir is None:
        if inferred_dir:
            is_dir = True
        else:
            is_dir = os.path.isdir(os.path.join(docs_dir, cleaned))
    return abs_href(cleaned, is_dir=is_dir)

def load_menu(menu_file: str) -> list:
    with open(menu_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError("menu 配置必须是数组")
    return data

def get_menu_title(item: dict) -> Optional[str]:
    title = item.get("title") or item.get("text") or item.get("name")
    if title is None:
        return None
    return str(title)

def get_menu_children(item: dict) -> list:
    children = item.get("children") or item.get("items")
    if children is None:
        return []
    if not isinstance(children, list):
        raise ValueError("menu item.children 必须是数组")
    return children

def build_menu_lines(items: list, docs_dir: str, depth: int) -> list[str]:
    lines: list[str] = []
    indent = "  " * depth
    for item in items:
        if isinstance(item, str):
            link = item
            base = os.path.basename(link.rstrip("/"))
            name = os.path.splitext(base)[0] if base else link
            title = human_title(name)
            href = resolve_menu_href(link, docs_dir, None)
            lines.append(f"{indent}* [{title}]({href})")
            continue

        if not isinstance(item, dict):
            raise ValueError("menu item 必须是对象或字符串")

        title = get_menu_title(item)
        if not title:
            raise ValueError("menu item 缺少 title")

        link = item.get("link") or item.get("path") or item.get("href")
        is_dir = item.get("dir") if "dir" in item else item.get("isDir")
        if link:
            href = resolve_menu_href(str(link), docs_dir, bool(is_dir) if is_dir is not None else None)
            lines.append(f"{indent}* [{title}]({href})")
        else:
            lines.append(f"{indent}* {title}")

        children = get_menu_children(item)
        if children:
            lines += build_menu_lines(children, docs_dir, depth + 1)

    return lines

def run_cmd(cmd: list[str], cwd: Optional[str] = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        cmd,
        cwd=cwd,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )

def get_repo_root(cwd: Optional[str] = None) -> Optional[str]:
    res = run_cmd(["git", "rev-parse", "--show-toplevel"], cwd=cwd)
    if res.returncode != 0:
        return None
    return res.stdout.strip()

def commit_file_if_changed(repo_root: str, rel_path: str, message: str) -> bool:
    status = run_cmd(["git", "status", "--porcelain", "--", rel_path], cwd=repo_root)
    if status.returncode != 0:
        raise RuntimeError(status.stderr.strip() or "git status 失败")
    if not status.stdout.strip():
        print("[INFO] 侧边栏无变化，跳过 git commit")
        return False

    add = run_cmd(["git", "add", "--", rel_path], cwd=repo_root)
    if add.returncode != 0:
        raise RuntimeError(add.stderr.strip() or "git add 失败")

    commit = run_cmd(["git", "commit", "-m", message, "--", rel_path], cwd=repo_root)
    if commit.returncode != 0:
        raise RuntimeError(commit.stderr.strip() or "git commit 失败")

    print(f"[OK] 已提交: {rel_path}")
    return True

def first_link_for_dir(base_dir: str, rel_dir: str):
    """
    为没有 README.md 的目录寻找一个“落地链接”：
    1) 若存在子目录，优先选择排序后的第一个子目录：
       - 如果该子目录有 README -> 链接到该子目录（目录链接）
       - 否则递归进入该子目录继续寻找
    2) 若存在文件（排除 README.md），选择排序后的第一个文件
    3) 若找不到，返回 (None, None)
    返回: (rel_path_from_docs_root, is_dir_link)
    """
    full_dir = os.path.join(base_dir, rel_dir)
    dirs, files = list_sorted(full_dir)

    # 1) 先看目录
    for d in dirs:
        child_rel = os.path.join(rel_dir, d) if rel_dir else d
        child_full = os.path.join(full_dir, d)
        if has_readme(child_full):
            return (child_rel.replace(os.sep, "/"), True)
        # 没有 README，向下递归
        sub_rel, sub_is_dir = first_link_for_dir(base_dir, child_rel)
        if sub_rel:
            return (sub_rel, sub_is_dir)

    # 2) 再看文件（已排除了 README.md）
    for f in files:
        if f == "README.md":
            continue
        file_rel = os.path.join(rel_dir, f) if rel_dir else f
        return (file_rel.replace(os.sep, "/"), False)

    # 3) 没有任何可用项
    return (None, None)

def build_lines(base_dir: str, rel_dir: str, depth: int) -> list[str]:
    """
    每层就地编号：目录在前、文件在后共同从 1 开始；首层也显示编号（n. 标题）。
    目录若无 README，则把目录链接指向该目录的“第一个子项”的链接（递归寻找）。
    """
    full_dir = os.path.join(base_dir, rel_dir)
    dirs, files = list_sorted(full_dir)
    lines: list[str] = []
    indent = "  " * depth
    idx = 0

    # --- 目录在前 ---
    for d in dirs:
        idx += 1
        child_rel = os.path.join(rel_dir, d) if rel_dir else d
        child_full = os.path.join(full_dir, d)
        title = human_title(d)
        visible = f"{idx}. {title}"

        if has_readme(child_full):
            href = abs_href(child_rel, is_dir=True)
            lines.append(f"{indent}* [{visible}]({href})")
        else:
            # 没有 README，为该目录寻找可落地链接
            link_rel, link_is_dir = first_link_for_dir(base_dir, child_rel)
            if link_rel:
                href = abs_href(link_rel, is_dir=link_is_dir)
                lines.append(f"{indent}* [{visible}]({href})")
            else:
                # 整棵分支都找不到链接目标——保持分组
                lines.append(f"{indent}* {visible}")

        # 递归输出目录的子项
        lines += build_lines(base_dir, child_rel, depth + 1)

    # --- 文件在后 ---
    for f in files:
        if rel_dir == "" and f == "README.md":
            continue
        if f == "README.md":
            continue
        idx += 1
        name = os.path.splitext(f)[0]
        title = human_title(name)
        file_rel = os.path.join(rel_dir, f) if rel_dir else f
        href = abs_href(file_rel, is_dir=False)
        visible = f"{idx}. {title}"
        lines.append(f"{indent}* [{visible}]({href})")

    return lines

def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="生成 docs/_sidebar.md（支持 menu 配置与可选自动提交）")
    parser.add_argument(
        "--commit",
        action="store_true",
        help="生成完成后自动执行 git commit（仅提交 docs/_sidebar.md）",
    )
    parser.add_argument(
        "--commit-message",
        default="chore(docs): update sidebar",
        help="git commit message（配合 --commit 使用）",
    )
    parser.add_argument(
        "--menu",
        default=None,
        help="menu 配置文件路径（默认使用 docs/menu.json，如果存在）",
    )
    return parser.parse_args(argv)

def main() -> int:
    args = parse_args(sys.argv[1:])

    base_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    docs_dir = os.path.join(base_root, DEFAULT_DOCS_DIR)
    if not os.path.isdir(docs_dir):
        print(f"[ERR] docs 目录不存在: {docs_dir}", file=sys.stderr)
        return 2

    output_file = os.path.join(base_root, DEFAULT_OUTPUT_FILE)

    lines: list[str] = []
    menu_file = args.menu
    default_menu = os.path.join(base_root, DEFAULT_MENU_FILE)
    menu_path = None
    if menu_file:
        menu_path = menu_file if os.path.isabs(menu_file) else os.path.join(base_root, menu_file)
    elif os.path.exists(default_menu):
        menu_path = default_menu

    if menu_path:
        try:
            menu_items = load_menu(menu_path)
        except (OSError, ValueError, json.JSONDecodeError) as e:
            print(f"[ERR] menu 配置读取失败: {e}", file=sys.stderr)
            return 3
        lines = build_menu_lines(menu_items, docs_dir, depth=0)
        rel_menu = os.path.relpath(menu_path, base_root)
        print(f"[OK] 使用 menu 配置: {rel_menu}")
    else:
        # Home 不编号
        root_readme = os.path.join(docs_dir, "README.md")
        if os.path.exists(root_readme):
            lines.append(f"* [Home]({BASE_PREFIX})")
        # 从根开始构建
        lines += build_lines(docs_dir, rel_dir="", depth=0)

    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"[OK] 生成完成: {os.path.relpath(output_file, base_root)}")
    print("[OK] doc url: http://localhost:4173/")

    if args.commit:
        repo_root = get_repo_root(cwd=base_root)
        if not repo_root:
            print("[ERR] 未检测到 git 仓库，无法执行 commit", file=sys.stderr)
            return 4

        rel_output = os.path.relpath(output_file, repo_root).replace(os.sep, "/")
        try:
            commit_file_if_changed(repo_root, rel_output, args.commit_message)
        except RuntimeError as e:
            print(f"[ERR] git commit 失败: {e}", file=sys.stderr)
            return 5

    return 0

if __name__ == "__main__":
    sys.exit(main())
