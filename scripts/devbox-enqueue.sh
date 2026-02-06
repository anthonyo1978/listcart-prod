#!/usr/bin/env bash
set -euo pipefail

# Usage: scripts/devbox-enqueue.sh TICKET-0012
TID="${1:-}"

if [ -z "${TID}" ]; then
  echo "Usage: $0 TICKET-XXXX" >&2
  exit 2
fi

# Repo root relative to this script
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

QUEUE="/home/aidev/.ai-devbox/queue.json"
PROCESSED="/home/aidev/.ai-devbox/processed.json"
INBOX_DIR="/home/aidev/.ai-devbox/inbox"

MAX_QUEUE_LEN="${MAX_QUEUE_LEN:-1}"  # refuse enqueue if queue already has >= this many items

# --- Find ticket file by id ---
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

ticket_path="$(find_ticket_file_by_id "$TID" || true)"
if [ -z "${ticket_path:-}" ]; then
  echo "ERROR: Ticket id $TID not found in tickets/*.md" >&2
  exit 3
fi

# --- Validate ticket status ---
if ! grep -q '^status: ready_for_dev' "$ticket_path"; then
  echo "ERROR: $TID is not ready_for_dev (check: $ticket_path)" >&2
  grep -n '^status:' "$ticket_path" >&2 || true
  exit 4
fi

# --- Ensure state files exist ---
mkdir -p /home/aidev/.ai-devbox "$INBOX_DIR"
[ -f "$QUEUE" ] || echo '{"queue":[]}' > "$QUEUE"
[ -f "$PROCESSED" ] || echo '{}' > "$PROCESSED"

# --- Refuse if already processed ---
if jq -e --arg id "$TID" '.[$id] != null' "$PROCESSED" >/dev/null 2>&1; then
  echo "INFO: $TID already processed; not enqueueing."
  exit 0
fi

# --- Refuse if already queued ---
if jq -e --arg id "$TID" '.queue | index($id) != null' "$QUEUE" >/dev/null 2>&1; then
  echo "INFO: $TID already in queue; not enqueueing."
  exit 0
fi

# --- Refuse if queue too long (PM pacing) ---
qlen="$(jq '.queue | length' "$QUEUE" 2>/dev/null || echo 0)"
if [ "${qlen}" -ge "${MAX_QUEUE_LEN}" ]; then
  echo "BUSY: queue length is ${qlen} (max allowed ${MAX_QUEUE_LEN}). Try again later." >&2
  exit 5
fi

# --- Write inbox enqueue request (atomic) ---
ts="$(date -u +%s)"
tmp="$(mktemp)"
echo "{\"ticket_id\":\"${TID}\"}" > "$tmp"
mv "$tmp" "$INBOX_DIR/queue-${TID}-${ts}.json"

echo "✅ Enqueued via inbox: $TID"
echo "   ticket: $ticket_path"
echo "   inbox:  $INBOX_DIR/queue-${TID}-${ts}.json"
