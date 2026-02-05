#!/usr/bin/env bash
set -euo pipefail

# ===== HARD RESET TO BASELINE (prevents branch-stall) =====
git fetch origin
git checkout -f main
git reset --hard origin/main


REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
# ===== PREFLIGHT ASSERTS =====
if [ -n "$(git status --porcelain)" ]; then
  echo "Preflight failed: working tree is dirty. Commit/stash changes first." >&2
  git status --porcelain >&2
  exit 21
fi

STATE_DIR="$REPO_DIR/.ai-devbox"
PROCESSED="/home/aidev/.ai-devbox/processed.json"

mkdir -p "$STATE_DIR/runs"
cd "$REPO_DIR"

git pull --ff-only

if [ ! -f "$PROCESSED" ]; then
  echo '{}' > "$PROCESSED"
fi

for ticket in tickets/*.md; do
  [ -f "$ticket" ] || continue

  if grep -q '^status: ready_for_dev' "$ticket"; then
    TID="$(awk '/^id: /{print $2; exit}' "$ticket" | tr -d '\r')"
    if jq -e --arg id "$TID" '.[$id] != null' "$PROCESSED" >/dev/null; then
      continue
    fi

    echo "Found ready ticket: $TID ($ticket)"
    echo "[runner] processing $TID"


        set +e
        scripts/ai-devbox-process-one.sh "$ticket" "$TID"
        rc=$?
        set -e

        # Treat certain exit codes as "processed but needs human"
        # (Pick the codes you use: 30 was your old "refusing to merge", add others if you have them)
        status=""
        ts="$(date -u +%FT%TZ)"

        if [ $rc -eq 0 ]; then
          status="$ts"
        elif [ $rc -eq 30 ]; then
          status="needs-review:$ts"
        else
          echo "Ticket $TID failed with exit code $rc; leaving unprocessed." >&2
          exit $rc
        fi

        tmp="$(mktemp)"
        jq --arg id "$TID" --arg status "$status" '. + {($id): $status}' "$PROCESSED" > "$tmp"
        mv "$tmp" "$PROCESSED"

        echo "[runner] marked $TID as $status"

  fi
done
