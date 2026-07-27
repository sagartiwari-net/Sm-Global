#!/usr/bin/env bash
# Quick helper: stage, commit, and push to Sm-Global
# Usage: ./push.sh "your commit message"

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if [[ ! -d .git ]]; then
  echo "Error: not a git repo. Run from the Sm-Global project root."
  exit 1
fi

MSG="${1:-Update SMM Global tasks}"

git status --short
git add .
if git diff --cached --quiet; then
  echo "Nothing new to commit."
  exit 0
fi

git commit -m "$MSG"
git push
echo "Done — pushed to origin."
