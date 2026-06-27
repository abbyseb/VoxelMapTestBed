#!/usr/bin/env bash
# Build voxelmap-testbed VSIX (Phase 1.3.8)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXT="$ROOT/extensions/voxelmap-testbed"

echo "==> Compile extension + webviews"
(cd "$EXT" && npm run compile && npm run check-types && npm test)

echo "==> Package VSIX"
if ! command -v vsce >/dev/null 2>&1; then
  echo "Installing @vscode/vsce locally..."
  (cd "$EXT" && npm install --no-save @vscode/vsce)
  VSCE="$EXT/node_modules/.bin/vsce"
else
  VSCE=vsce
fi

mkdir -p "$ROOT/release"
(cd "$EXT" && "$VSCE" package --no-dependencies -o "$ROOT/release/voxelmap-testbed.vsix")
echo "OK: $ROOT/release/voxelmap-testbed.vsix"
