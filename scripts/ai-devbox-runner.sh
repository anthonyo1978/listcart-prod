#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

# ===== HARD RESET TO BASELINE (prevents branch-stall) =====
git fetch origin
git checkout -f main
git reset --hard origin/main

# ===== PREFLIGHT ASSERTS =====
if [ -n "$(git status --porcelain)" ]; then
  echo "Preflight failed: working tree is dirty. Commit/stash changes first." >&2
  git status --porcelain >&2
  exit 21
fi

STATE_DIR="$REPO_DIR/.ai-devbox"
PROCESSED="/home/aidev/.ai-devbox/processed.json"
QUEUE="/home/aidev/.ai-devbox/queue.json"
INBOX_DIR="/home/aidev/.ai-devbox/inbox"
INBOX_DONE="/home/aidev/.ai-devbox/inbox_done"


mkdir -p "$STATE_DIR/runs"

git pull --ff-only

if [ ! -f "$PROCESSED" ]; then
  echo '{}' > "$PROCESSED"
fi

# Queue is optional; if present and non-empty, it defines the next ticket deterministically.
# Format: { "queue": ["TICKET-0009", "TICKET-0010"] }
if [ ! -f "$QUEUE" ]; then
  echo '{"queue":[]}' > "$QUEUE"
fi

# ===== INBOX -> QUEUE (external enqueue mechanism) =====
mkdir -p "$INBOX_DIR" "$INBOX_DONE"

enqueue_ticket() {
  local tid="$1"
  local tmp
  tmp="$(mktemp)"

  # Skip if already processed
  if jq -e --arg id "$tid" '.[$id] != null' "$PROCESSED" >/dev/null; then
    echo "[inbox] $tid already processed; not enqueuing"
    return 0
  fi

  # Skip if already queued
  if jq -e --arg id "$tid" '.queue | index($id) != null' "$QUEUE" >/dev/null; then
    echo "[inbox] $tid already in queue; not enqueuing"
    return 0
  fi

  jq --arg id "$tid" '.queue += [$id]' "$QUEUE" > "$tmp"
  mv "$tmp" "$QUEUE"
  echo "[inbox] enqueued $tid"
}

# Drain inbox files (each file should contain JSON like: {"ticket_id":"TICKET-0012"})
shopt -s nullglob
for f in "$INBOX_DIR"/*.json; do
  tid="$(jq -r '.ticket_id // empty' "$f" 2>/dev/null || true)"
  if [ -z "${tid:-}" ]; then
    echo "[inbox] invalid file (missing ticket_id): $f" >&2
    mv "$f" "$INBOX_DONE/$(basename "$f").bad.$(date -u +%s)" || true
    continue
  fi

  enqueue_ticket "$tid"
  mv "$f" "$INBOX_DONE/$(basename "$f").done.$(date -u +%s)" || true
done
shopt -u nullglob


pick_queued_ticket() {
  jq -r '.queue[0] // empty' "$QUEUE"
}

dequeue_ticket() {
  local tid="$1"
  local tmp
  tmp="$(mktemp)"
  # Only remove if it's currently at head of queue (prevents surprises)
  jq --arg tid "$tid" '
    if (.queue[0] // "") == $tid then
      .queue = (.queue[1:] // [])
    else
      .
    end
  ' "$QUEUE" > "$tmp"
  mv "$tmp" "$QUEUE"
}

find_ticket_file_by_id() {
  local tid="$1"
  local f
  for f in tickets/*.md; do
    [ -f "$f" ] || continue
    if awk '/^id: /{print $2; exit}' "$f" | tr -d '\r' | grep -qx "$tid"; then
      echo "$f"
      return 0
    fi
  done
  return 1
}

mark_processed() {
  local tid="$1"
  local status="$2"
  local tmp
  tmp="$(mktemp)"
  jq --arg id "$tid" --arg status "$status" '. + {($id): $status}' "$PROCESSED" > "$tmp"
  mv "$tmp" "$PROCESSED"
}

# ===== QUEUE MODE (deterministic next ticket) =====
TID_QUEUED="$(pick_queued_ticket || true)"
if [ -n "${TID_QUEUED:-}" ]; then
  ticket_path="$(find_ticket_file_by_id "$TID_QUEUED" || true)"
  if [ -z "${ticket_path:-}" ]; then
    echo "Queued ticket $TID_QUEUED not found in tickets/*.md; leaving in queue." >&2
    exit 22
  fi

  if jq -e --arg id "$TID_QUEUED" '.[$id] != null' "$PROCESSED" >/dev/null; then
    echo "Queued ticket $TID_QUEUED already processed; dequeuing and exiting."
    dequeue_ticket "$TID_QUEUED"
    exit 0
  fi

  echo "Found queued ticket: $TID_QUEUED ($ticket_path)"
  echo "[runner] processing $TID_QUEUED"

  set +e
  scripts/ai-devbox-process-one.sh "$ticket_path" "$TID_QUEUED"
  rc=$?
  set -e

  ts="$(date -u +%FT%TZ)"
  if [ $rc -eq 0 ]; then
    mark_processed "$TID_QUEUED" "$ts"
    dequeue_ticket "$TID_QUEUED"
    echo "[runner] marked $TID_QUEUED as $ts (and dequeued)"
    exit 0
  elif [ $rc -eq 30 ]; then
    mark_processed "$TID_QUEUED" "needs-review:$ts"
    dequeue_ticket "$TID_QUEUED"
    echo "[runner] marked $TID_QUEUED as needs-review:$ts (and dequeued)"
    exit 0
  else
    echo "Ticket $TID_QUEUED failed with exit code $rc; leaving unprocessed and leaving in queue." >&2
    exit $rc
  fi
fi

# ===== FALLBACK SCAN MODE (current behaviour, but only 1 ticket per run) =====
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

    ts="$(date -u +%FT%TZ)"
    if [ $rc -eq 0 ]; then
      mark_processed "$TID" "$ts"
      echo "[runner] marked $TID as $ts"
      exit 0
    elif [ $rc -eq 30 ]; then
      mark_processed "$TID" "needs-review:$ts"
      echo "[runner] marked $TID as needs-review:$ts"
      exit 0
    else
      echo "Ticket $TID failed with exit code $rc; leaving unprocessed." >&2
      exit $rc
    fi
  fi
done

# No queued ticket and no ready tickets found
exit 0
