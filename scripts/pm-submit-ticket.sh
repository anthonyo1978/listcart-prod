#!/usr/bin/env bash
set -euo pipefail

# ACCEPT: either "TICKET-XXXX" or "tickets/TICKET-XXXX.md"
ARG="${1:-}"

if [[ -z "${ARG}" ]]; then
  echo "ERROR: Usage: scripts/pm-submit-ticket.sh TICKET-XXXX  OR  tickets/TICKET-XXXX.md" >&2
  echo "SUBMISSION_FAILED UNKNOWN_TICKET"
  exit 1
fi

# Normalize to repo-relative ticket file path
if [[ "${ARG}" =~ ^TICKET-[0-9]+$ ]]; then
  FILE="tickets/${ARG}.md"
elif [[ "${ARG}" =~ ^tickets/TICKET-[0-9]+\.md$ ]]; then
  FILE="${ARG}"
else
  echo "ERROR: Usage: scripts/pm-submit-ticket.sh TICKET-XXXX  OR  tickets/TICKET-XXXX.md" >&2
  echo "SUBMISSION_FAILED UNKNOWN_TICKET"
  exit 1
fi

TICKET_ID="$(basename "${FILE}" .md)"

fail() {
  echo "ERROR: $1" >&2
  echo "SUBMISSION_FAILED ${TICKET_ID}"
  exit 1
}

# Ensure we're running from repo root
cd "$(dirname "$0")/.."

# Sync first to avoid push rejection
git pull --rebase origin main || fail "git pull --rebase failed"

# Validate file exists in repo working tree
[[ -f "${FILE}" ]] || fail "file not found in repo working tree: ${FILE}"

# Stage and ensure there's something to commit
git add "${FILE}" || fail "git add failed for ${FILE}"

if git diff --cached --quiet; then
  fail "nothing to commit for ${FILE}"
fi

# Commit and push
git commit -m "ticket: add ${TICKET_ID}" || fail "git commit failed"
git push origin main || fail "git push failed"

# Verify on origin
git fetch origin main || fail "git fetch origin main failed"
if git ls-tree origin/main "${FILE}" | grep -q "${FILE}"; then
  echo "SUBMISSION_SUCCESS ${TICKET_ID}"
  exit 0
else
  fail "origin verification failed: ${FILE} not found on origin/main"
fi
