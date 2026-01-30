#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

echo "=== RESUME TASK ==="
echo "Time: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "Repo: $REPO_ROOT"
echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
echo

echo "== TASK STATE =="
if [ -f memory/TASK_STATE.md ]; then
  cat memory/TASK_STATE.md
else
  echo "TASK_STATE missing"
fi
echo

echo "== git status (porcelain) =="
git status --porcelain || true
echo

echo "== LOCK TRUTH PROBE =="
ls -la .next/lock 2>/dev/null || echo "NO_LOCK_FILE"
echo

echo "== BUILD LOG (last 30 lines) =="
tail -n 30 /tmp/build.log 2>/dev/null || echo "NO_BUILD_LOG"
echo

echo "== TRUTH GATE =="
./scripts/truth-gate.sh || EXIT=$?
echo "EXIT=${EXIT:-0}"

