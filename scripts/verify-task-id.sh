#!/usr/bin/env bash
# Verify a BUILD_PLAN task ID: compile, typecheck, unit tests, registry check.
# Optional: commit + push ONLY when all checks pass (--push).
#
# Usage:
#   bash scripts/verify-task-id.sh 1.1.2
#   bash scripts/verify-task-id.sh 1.1.2 --push
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXT="$ROOT/extensions/voxelmap-testbed"
REGISTRY="$ROOT/docs/TASK_REGISTRY.md"
TASK_ID="${1:-}"
DO_PUSH=false

for arg in "${@:2}"; do
  if [[ "$arg" == "--push" ]]; then
    DO_PUSH=true
  fi
done

if [[ -z "$TASK_ID" ]]; then
  echo "Usage: bash scripts/verify-task-id.sh <TASK_ID> [--push]"
  echo "Example: bash scripts/verify-task-id.sh 1.1.2 --push"
  echo ""
  echo "  --push   git commit + push ONLY after compile, typecheck, and tests pass"
  exit 1
fi

echo "==> VoxelMap TestBed verify: task $TASK_ID"
echo "==> Root: $ROOT"

if [[ ! -d "$EXT" ]]; then
  echo "ERROR: Extension not found at $EXT"
  exit 1
fi

echo "==> [1/5] Compile extension"
(cd "$EXT" && npm run compile)

echo "==> [2/5] Typecheck extension"
(cd "$EXT" && npm run check-types)

echo "==> [3/5] Unit tests"
(cd "$EXT" && npm test)

echo "==> [4/5] Registry check"
if [[ ! -f "$REGISTRY" ]]; then
  echo "ERROR: TASK_REGISTRY.md missing"
  exit 1
fi

if ! grep -q "| $TASK_ID |" "$REGISTRY"; then
  echo "WARN: Task $TASK_ID not found in TASK_REGISTRY.md — add a row before QA sign-off"
  exit 1
fi

if grep "| $TASK_ID |" "$REGISTRY" | grep -q "| yes |"; then
  echo "OK: Task $TASK_ID is marked verified in registry"
else
  echo "WARN: Task $TASK_ID found but not verified: yes — QA must update registry after review"
  exit 1
fi

echo ""
echo "PASS: Task $TASK_ID verification complete (tests successful)"

if [[ "$DO_PUSH" != "true" ]]; then
  echo "TIP: Run with --push to commit and push after successful verification"
  exit 0
fi

echo ""
echo "==> [5/5] Git commit + push (tests passed — safe to push)"

cd "$ROOT"

TASK_DESC="$(grep "| $TASK_ID |" "$REGISTRY" | head -1 | awk -F'|' '{gsub(/^ +| +$/, "", $3); print $3}')"

if [[ -z "$TASK_DESC" ]]; then
  TASK_DESC="BUILD_PLAN task $TASK_ID"
fi

if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git commit -m "$(cat <<EOF
task($TASK_ID): $TASK_DESC

Verified: compile, typecheck, and unit tests pass.
EOF
)"
  echo "OK: Committed task $TASK_ID"
else
  echo "OK: Working tree clean — nothing to commit"
fi

if git rev-parse --abbrev-ref @{u} >/dev/null 2>&1; then
  git push
  echo "OK: Pushed to origin"
else
  git push -u origin HEAD
  echo "OK: Pushed to origin (upstream set)"
fi

echo ""
echo "DONE: Task $TASK_ID verified, committed, and pushed"
