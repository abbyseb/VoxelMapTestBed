# voxelmap-testbed extension

VS Code / VSCodium extension for **VoxelMap TestBed** (Phase 1 — mock mode).

## Dev setup

1. Open this folder in [VSCodium](https://vscodium.com/):
   ```
   VoxelMapTestBed/extensions/voxelmap-testbed
   ```
2. Install deps (once): `npm install`
3. **F5** → Extension Development Host
4. You should see: *"VoxelMap TestBed ready (mock mode)"* and the **VoxelMap TestBed** activity bar icon (cube).
5. Open the sidebar — four views: **Gold**, **Experiments**, **Runs**, **Leaderboard** (stub data until fixtures in 1.1.4+).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run compile` | One-shot esbuild → `dist/extension.js` |
| `npm run watch` | Rebuild on save (used by F5 preLaunchTask) |
| `npm run check-types` | `tsc --noEmit` |

## Settings (Phase 1)

- `vmtb.dataMode` — `mock` (default) or `live`
- `vmtb.goldPath` — local Gold folder (live mode, Phase 4+)
- `vmtb.fixturesPath` — override fixtures path (mock mode)

See [BUILD_PLAN.md](../../BUILD_PLAN.md) §8.1 for the full Phase 1 roadmap.
