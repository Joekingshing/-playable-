#!/usr/bin/env python3
import argparse
import json
import os
import sys


def load_spec(path):
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def main():
    parser = argparse.ArgumentParser(
        description="Verify playable-phaser src structure and README.md coverage."
    )
    parser.add_argument(
        "--root",
        default=".",
        help="Workspace root that contains the project folder.",
    )
    parser.add_argument(
        "--project",
        default=None,
        help="Project folder name. Defaults to spec projectName.",
    )
    parser.add_argument(
        "--spec",
        default=os.path.join(
            os.path.dirname(__file__), "..", "references", "src-structure.json"
        ),
        help="Path to structure spec JSON.",
    )
    args = parser.parse_args()

    spec_path = os.path.abspath(args.spec)
    spec = load_spec(spec_path)
    project_name = args.project or spec.get("projectName", "playable-phaser")
    project_dir = os.path.abspath(os.path.join(args.root, project_name))
    readme_name = spec.get("readmeName", "README.md")

    errors = []
    if not os.path.isdir(project_dir):
        errors.append(f"project directory missing: {project_dir}")

    for rel_dir in spec.get("srcDirs", []):
        dir_path = os.path.join(project_dir, rel_dir)
        if not os.path.isdir(dir_path):
            errors.append(f"missing directory: {dir_path}")
            continue
        readme_path = os.path.join(dir_path, readme_name)
        if not os.path.isfile(readme_path):
            errors.append(f"missing README.md: {readme_path}")

    for rel_file in spec.get("srcFiles", []):
        file_path = os.path.join(project_dir, rel_file)
        if not os.path.isfile(file_path):
            errors.append(f"missing file: {file_path}")

    if errors:
        print("[ERROR] Structure check failed.")
        for error in errors:
            print(f"- {error}")
        return 1

    print("[OK] Structure check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
