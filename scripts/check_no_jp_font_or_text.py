#!/usr/bin/env python3
"""Equivalent Japanese-text and Japanese-font scan.

thedoghaoX/smith-sync was not readable from this environment (GitHub HTTP 404),
so this is a local stand-in for scripts/check_no_jp_font_or_text.py.
It flags Hiragana, Katakana, halfwidth Katakana, and Japanese font family names.
Traditional Chinese and the declared Traditional Chinese font stack are allowed.

Prints JSON. Exit 0 only when violation_count is 0.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

TEXT_SUFFIXES = {
    ".html", ".md", ".json", ".tsx", ".ts", ".css", ".py", ".txt", ".svg", ".js",
}
SKIP_DIR_NAMES = {".git", "node_modules"}

# Unicode escapes keep this file free of the characters it detects.
KANA = (
    "[\u3040-\u309f"  # Hiragana
    "\u30a0-\u30ff"  # Katakana
    "\uff66-\uff9d]"  # halfwidth Katakana
)

# Contiguous names are assembled so this source does not contain them literally.
FONT_PARTS = [
    ("Noto Sans ", "JP"),
    ("Noto Serif ", "JP"),
    ("Noto Sans CJK ", "JP"),
    ("Noto Serif CJK ", "JP"),
    ("Source Han Sans ", "JP"),
    ("Source Han Serif ", "JP"),
    ("Yu ", "Gothic"),
    ("Yu", "Gothic"),
    ("Yu ", "Mincho"),
    ("Yu", "Mincho"),
    ("Meir", "yo"),
    ("MS ", "Gothic"),
    ("MS ", "Mincho"),
    ("MS P", "Gothic"),
    ("MS P", "Mincho"),
    ("Hira", "gino"),
    ("IPA", "ex"),
    ("IPA", "Gothic"),
    ("IPA", "Mincho"),
    ("Kozu", "ka"),
]


def font_needles() -> list[str]:
    names = ["".join(parts) for parts in FONT_PARTS]
    # Japanese-script font names, stored as code points.
    names.append("".join(chr(n) for n in (0x30E1, 0x30A4, 0x30EA, 0x30AA)))
    names.append("".join(chr(n) for n in (0x30D2, 0x30E9, 0x30AE, 0x30CE)))
    names.append("".join(chr(n) for n in (0x6E38, 0x30B4, 0x30B7, 0x30C3, 0x30AF)))
    names.append("".join(chr(n) for n in (0x6E38, 0x660E, 0x671D)))
    return names


import re

KANA_RE = re.compile(KANA)
FONTS = font_needles()


def iter_files(paths: list[Path]) -> list[Path]:
    found: list[Path] = []
    for path in paths:
        if path.is_dir():
            for child in path.rglob("*"):
                if any(part in SKIP_DIR_NAMES for part in child.parts):
                    continue
                if child.is_file() and child.suffix.lower() in TEXT_SUFFIXES:
                    found.append(child)
        elif path.is_file():
            found.append(path)
    return sorted(set(found))


def scan_file(path: Path) -> list[dict]:
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        text = path.read_text(encoding="utf-8", errors="replace")
    hits = []
    for lineno, line in enumerate(text.splitlines(), 1):
        for match in KANA_RE.finditer(line):
            hits.append({
                "file": str(path),
                "line": lineno,
                "kind": "japanese_kana",
                "excerpt": line.strip()[:160],
                "match": match.group(0),
            })
        lower = line.lower()
        for name in FONTS:
            if name.lower() in lower:
                hits.append({
                    "file": str(path),
                    "line": lineno,
                    "kind": "japanese_font",
                    "excerpt": line.strip()[:160],
                    "match": name,
                })
    return hits


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("usage: check_no_jp_font_or_text.py <file-or-dir>...", file=sys.stderr)
        return 2
    paths = [Path(arg) for arg in argv[1:]]
    missing = [str(path) for path in paths if not path.exists()]
    files = iter_files(paths)
    violations = []
    for path in files:
        violations.extend(scan_file(path))
    report = {
        "equivalent_scan": True,
        "upstream": "thedoghaoX/smith-sync scripts/check_no_jp_font_or_text.py unavailable (HTTP 404)",
        "files_scanned": len(files),
        "missing_paths": missing,
        "violation_count": len(violations),
        "violations": violations,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if violations or missing else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
