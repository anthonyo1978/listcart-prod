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

bash -lc "$AI_AGENT_CMD" | tee -a "$RUN_DIR/agent.log"

# Refuse only if there are no commits on this branch
if [ "$(git rev-list --count main..HEAD)" -eq 0 ]; then
  echo "Agent produced no commits; nothing to merge." | tee -a "$RUN_DIR/summary.md"
  exit 0
fi

echo "Agent produced commits; proceeding with auto-merge." | tee -a "$RUN_DIR/summary.md"


# Determine whether the agent produced commits or working-tree changes

# How many commits ahead of origin/main are we?
ahead_count="$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)"

if [ "${ahead_count}" -gt 0 ]; then
  echo "Agent produced ${ahead_count} commit(s); proceeding to auto-merge." | tee -a "$RUN_DIR/summary.md"
else
  # No commits ahead — maybe the agent left changes uncommitted.
  if ! git diff --quiet; then
    echo "Agent left uncommitted changes; committing them now." | tee -a "$RUN_DIR/summary.md"
    git add -A
    git commit -m "feat: implement ${TID} (AI DevBox)" || true
    ahead_count="$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)"
  fi

  if [ "${ahead_count}" -eq 0 ]; then
    echo "Agent produced no commits or changes; refusing to merge." | tee -a "$RUN_DIR/summary.md"
    exit 31
  fi
fi


# ===== YOLO MERGE MODE =====
echo "YOLO: merging $BRANCH -> main" | tee -a "$RUN_DIR/summary.md"

git status --porcelain >/dev/null || true

git checkout main
git reset --hard origin/main

git merge --no-ff "$BRANCH" -m "Merge $BRANCH ($TID)"
git push origin main

echo "YOLO: merged and pushed to main" | tee -a "$RUN_DIR/summary.md"

