#!/usr/bin/env bash
set -euo pipefail

echo "=== TRUTH GATE ==="
echo "Time: $(date -Is)"
echo "Repo: $(git rev-parse --show-toplevel)"
echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
echo

echo "== git status (porcelain) =="
git status --porcelain || true
echo

LOG="/tmp/build.log"
rm -f "$LOG"

echo "== npm run build =="
npm run build |& tee "$LOG"

echo
echo "=== BUILD PROOF (last 20 lines) ==="
tail -n 20 "$LOG" || true
echo
echo "=== BUILD LOG HASH ==="
sha256sum "$LOG" || true

echo "=== TRUTH GATE PASS @ $(date -Is) ==="

