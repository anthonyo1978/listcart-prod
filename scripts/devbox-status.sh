#!/usr/bin/env bash
set -euo pipefail

PROCESSED="/home/aidev/.ai-devbox/processed.json"
QUEUE="/home/aidev/.ai-devbox/queue.json"
INBOX_DIR="/home/aidev/.ai-devbox/inbox"
INBOX_DONE="/home/aidev/.ai-devbox/inbox_done"

echo "== DevBox Status =="
echo "Host: $(hostname)"
echo "Time: $(date -u +%FT%TZ)"
echo

if [ -f "$QUEUE" ]; then
  qlen="$(jq '.queue | length' "$QUEUE")"
  head="$(jq -r '.queue[0] // empty' "$QUEUE")"
else
  qlen="(missing)"
  head=""
fi

echo "Queue length: $qlen"
if [ -n "${head:-}" ]; then
  echo "Queue head:   $head"
else
  echo "Queue head:   (none)"
fi
echo

if [ -d "$INBOX_DIR" ]; then
  inbox_count="$(ls -1 "$INBOX_DIR"/*.json 2>/dev/null | wc -l | tr -d ' ')"
else
  inbox_count="(missing)"
fi
echo "Inbox pending files: $inbox_count"

if [ -d "$INBOX_DONE" ]; then
  last_done="$(ls -1t "$INBOX_DONE" 2>/dev/null | head -n 1 || true)"
else
  last_done=""
fi
if [ -n "${last_done:-}" ]; then
  echo "Last inbox archived: $last_done"
else
  echo "Last inbox archived: (none)"
fi
echo

if [ -f "$PROCESSED" ]; then
  processed_count="$(jq 'keys | length' "$PROCESSED")"
  last_processed="$(jq -r 'to_entries | sort_by(.value) | last | "\(.key) => \(.value)"' "$PROCESSED" 2>/dev/null || true)"
else
  processed_count="(missing)"
  last_processed=""
fi

echo "Processed count: $processed_count"
if [ -n "${last_processed:-}" ]; then
  echo "Last processed:  $last_processed"
else
  echo "Last processed:  (none)"
fi
