#!/usr/bin/env bash
set -euo pipefail

echo "== preflight: repo sync + cleanliness check =="

# Make sure we're in a git repo
git rev-parse --is-inside-work-tree >/dev/null

# Always sync first
git fetch origin main
git pull --rebase origin main

# Refuse to proceed if working tree is dirty
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: working tree is dirty. Commit/stash/restore before proceeding."
  git status
  exit 1
fi

echo "OK: up to date and clean."
