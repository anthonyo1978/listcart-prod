#!/usr/bin/env bash
set -euo pipefail

PROCESSED="/home/aidev/.ai-devbox/processed.json"
QUEUE="/home/aidev/.ai-devbox/queue.json"
INBOX_DIR="/home/aidev/.ai-devbox/inbox"
INBOX_DONE="/home/aidev/.ai-devbox/inbox_done"

now_utc() { date -u +%FT%TZ; }

safe_jq() {
  # Usage: safe_jq <jq_filter> <file>
  # Prints result or empty string on error.
  local filter="$1"
  local file="$2"
  jq -r "$filter" "$file" 2>/dev/null || true
}

file_exists() { [ -f "$1" ]; }
dir_exists() { [ -d "$1" ]; }

json_ok() {
  # Validate JSON file quietly
  local file="$1"
  jq -e . "$file" >/dev/null 2>&1
}

echo "== DevBox Status =="
echo "Host: $(hostname)"
echo "Time: $(now_utc)"
echo

# -----------------------
# Queue
# -----------------------
echo "-- Queue --"

queue_len="0"
queue_head=""

if file_exists "$QUEUE"; then
  if json_ok "$QUEUE"; then
    queue_len="$(safe_jq '.queue | length // 0' "$QUEUE")"
    queue_head="$(safe_jq '.queue[0] // empty' "$QUEUE")"
    # In case .queue isn't an array
    if ! [[ "$queue_len" =~ ^[0-9]+$ ]]; then queue_len="0"; fi
  else
    queue_len="(invalid json)"
    queue_head=""
  fi
else
  queue_len="(missing)"
  queue_head=""
fi

echo "Queue length: $queue_len"
if [ -n "${queue_head:-}" ]; then
  echo "Queue head:   $queue_head"
else
  echo "Queue head:   (none)"
fi
echo

# -----------------------
# Inbox
# -----------------------
echo "-- Inbox --"

inbox_pending="0"
if dir_exists "$INBOX_DIR"; then
  inbox_pending="$(find "$INBOX_DIR" -maxdepth 1 -type f -name '*.json' 2>/dev/null | wc -l | tr -d ' ')"
else
  inbox_pending="(missing)"
fi
echo "Pending inbox files: $inbox_pending"

last_archived=""
if dir_exists "$INBOX_DONE"; then
  # Use find + stat to avoid relying on ls ordering differences
  last_archived="$(find "$INBOX_DONE" -maxdepth 1 -type f 2>/dev/null -print0 \
    | xargs -0 stat -f '%m %N' 2>/dev/null \
    | sort -nr \
    | head -n 1 \
    | cut -d' ' -f2- || true)"
fi

if [ -n "${last_archived:-}" ]; then
  echo "Last inbox archived: $last_archived"
else
  echo "Last inbox archived: (none)"
fi
echo

# -----------------------
# Processed
# -----------------------
echo "-- Processed --"

processed_count="0"
last_processed=""

if file_exists "$PROCESSED"; then
  if json_ok "$PROCESSED"; then
    processed_count="$(safe_jq 'keys | length' "$PROCESSED")"
    if ! [[ "$processed_count" =~ ^[0-9]+$ ]]; then processed_count="0"; fi

    # Find the most recent entry by extracting a sortable timestamp.
    # Values may be:
    # - "2026-02-06T03:20:46Z"
    # - "needs-review:2026-02-06T03:20:46Z"
    last_processed="$(jq -r '
      to_entries
      | map(
          .ts = (
            if (.value|type)=="string" then
              ( .value | sub("^needs-review:";"") )
            else
              ""
            end
          )
        )
      | map(select(.ts != ""))
      | sort_by(.ts)
      | last
      | "\(.key) => \(.value)"' "$PROCESSED" 2>/dev/null || true)"
  else
    processed_count="(invalid json)"
    last_processed=""
  fi
else
  processed_count="(missing)"
  last_processed=""
fi

echo "Processed tickets: $processed_count"
if [ -n "${last_processed:-}" ]; then
  echo "Last processed:    $last_processed"
else
  echo "Last processed:    (none)"
fi

exit 0
