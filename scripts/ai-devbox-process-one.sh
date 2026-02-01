#!/usr/bin/env bash
set -euo pipefail

TICKET_FILE="$1"
TID="$2"

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

RUN_ID="$(date -u +%FT%TZ | tr ':' '-')"
RUN_DIR=".ai-devbox/runs/$RUN_ID"
mkdir -p "$RUN_DIR"

cp system.md "$RUN_DIR/system.md"
cp "$TICKET_FILE" "$RUN_DIR/ticket.md"

# clean base
git fetch origin
git checkout main >/dev/null 2>&1 || true
git reset --hard origin/main

BRANCH="ai/${TID,,}"
git checkout -B "$BRANCH"

# ===== AGENT INVOCATION =====
source /home/aidev/.aidev_env

if [ -z "${AI_AGENT_CMD:-}" ]; then
  echo "Agent not configured. Set AI_AGENT_CMD." | tee "$RUN_DIR/summary.md"
  exit 10
fi

bash -lc "$AI_AGENT_CMD"

# ===== YOLO MERGE MODE =====
echo "YOLO: merging $BRANCH -> main" | tee -a "$RUN_DIR/summary.md"

git status --porcelain >/dev/null || true

git checkout main
git reset --hard origin/main

git merge --no-ff "$BRANCH" -m "Merge $BRANCH ($TID)"
git push origin main

echo "YOLO: merged and pushed to main" | tee -a "$RUN_DIR/summary.md"

