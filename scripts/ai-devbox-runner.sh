#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
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
    scripts/ai-devbox-process-one.sh "$ticket" "$TID"

    tmp="$(mktemp)"
    jq --arg id "$TID" --arg ts "$(date -u +%FT%TZ)" '. + {($id): $ts}' "$PROCESSED" > "$tmp"
    mv "$tmp" "$PROCESSED"
  fi
done
