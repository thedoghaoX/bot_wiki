#!/usr/bin/env python3
"""Equivalent public-repo red-line scan.

thedoghaoX/smith-sync was not readable from this environment (GitHub HTTP 404),
so this is a local stand-in for scripts/precommit_scan.py. Rules follow
CLONE_SITE_INTEGRATION_SPEC.md plus the 2026-11-01 public cleanup:

- internal assistant name, hostnames, intranet addresses, internal paths
- tuning parameters called out for removal, question-bank stat keys,
  and pages removed from this public tree

Calling `precommit_scan.py bot_wiki` scans the repository root when that
subdirectory does not exist, because this repository is bot_wiki itself.

Prints JSON. Exit 0 only when hits is 0.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

TEXT_SUFFIXES = {
    ".html", ".md", ".json", ".tsx", ".ts", ".css", ".py", ".txt", ".svg", ".js",
}
SKIP_DIR_NAMES = {".git", "node_modules"}
THIS_FILE = Path(__file__).resolve()
JP_SCAN = (Path(__file__).resolve().parent / "check_no_jp_font_or_text.py").resolve()


def u(*codes: int) -> str:
    return "".join(chr(code) for code in codes)


RULES: list[tuple[str, re.Pattern[str]]] = [
    ("internal_assistant_name", re.compile(u(0x5206, 0x8EAB))),
    (
        "private_ip",
        re.compile(
            r"\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}"
            r"|192\.168\.\d{1,3}\.\d{1,3}"
            r"|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b"
        ),
    ),
    ("internal_host", re.compile(r"\b[\w.-]+\.(?:local|internal|lan|corp)\b", re.I)),
    ("internal_path", re.compile(r"(?:/home/|/Users/|[A-Za-z]:\\Users\\)")),
    ("tuning_lufs", re.compile(r"-14\s*LUFS", re.I)),
    ("tuning_redraw", re.compile(r"\b0\.35\b")),
    ("tuning_split_80", re.compile(r"80\s*%")),
    ("tuning_split_20", re.compile(r"20\s*%")),
    ("gate_code_q", re.compile(r"Q1\s*[~～\-—至到]\s*Q6")),
    (
        "question_bank_stat_key",
        re.compile(
            r"pre_dedup_declared_total|file_scanned_total|canonical_retained|"
            r"matrix_cells|matrix_empty_cells|matrix_historical|matrix_new_wave|"
            r"subsystem_labels|retained_by_os|declared_but_unmaterialized"
        ),
    ),
    ("removed_clone_tree", re.compile("pages/" + "clone/")),
    ("removed_english_page", re.compile("dual-loop-" + "reasoning")),
]


def resolve_root(arg: str) -> Path:
    path = Path(arg)
    if path.exists():
        return path
    if arg == "bot_wiki":
        return Path(".")
    print(json.dumps({
        "hits": 1,
        "error": f"path not found: {arg}",
        "items": [{"file": arg, "line": 0, "rule": "missing_path", "excerpt": ""}],
    }, ensure_ascii=False, indent=2))
    raise SystemExit(1)


def iter_files(root: Path) -> list[Path]:
    found: list[Path] = []
    if root.is_file():
        return [root]
    for child in root.rglob("*"):
        if any(part in SKIP_DIR_NAMES for part in child.parts):
            continue
        if not child.is_file():
            continue
        if child.suffix.lower() not in TEXT_SUFFIXES:
            continue
        resolved = child.resolve()
        if resolved in {THIS_FILE, JP_SCAN}:
            continue
        found.append(child)
    return sorted(found)


def scan_file(path: Path) -> list[dict]:
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        text = path.read_text(encoding="utf-8", errors="replace")
    hits = []
    for lineno, line in enumerate(text.splitlines(), 1):
        for rule, pattern in RULES:
            if pattern.search(line):
                hits.append({
                    "file": str(path),
                    "line": lineno,
                    "rule": rule,
                    "excerpt": line.strip()[:180],
                })
    return hits


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: precommit_scan.py <path>", file=sys.stderr)
        return 2
    root = resolve_root(argv[1])
    files = iter_files(root)
    items = []
    for path in files:
        items.extend(scan_file(path))
    report = {
        "equivalent_scan": True,
        "upstream": "thedoghaoX/smith-sync scripts/precommit_scan.py unavailable (HTTP 404)",
        "scanned_root": str(root),
        "files_scanned": len(files),
        "detector_scripts_excluded": True,
        "hits": len(items),
        "items": items,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if items else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
