# VoxelMap TestBed — Developer workflow

Run the extension in **mock mode** (default) against repo `fixtures/` — no Gold pack or GPU required.

## Prerequisites

1. Install [VSCodium](https://vscodium.com/) (or VS Code).
2. Clone [VoxelMapTestBed](https://github.com/abbyseb/VoxelMapTestBed.git).

## Open the extension project

```
File → Open Folder → …/VoxelMapTestBed/extensions/voxelmap-testbed
```

Install dependencies once:

```bash
cd extensions/voxelmap-testbed
npm install
```

## F5 — Extension Development Host

1. Open `extensions/voxelmap-testbed` in VSCodium.
2. Press **F5** (or Run → Start Debugging).
3. A new **Extension Development Host** window opens.
4. In that window:
   - Click the **TestBed** activity bar icon (cube, left sidebar).
   - You should see four panels: **Gold**, **Experiments**, **Runs**, **Leaderboard**.

## Mock data (Phase 1)

Fixtures live at repo root:

```
VoxelMapTestBed/fixtures/
├── manifest.yaml
├── baselines/smoke.json
├── experiments/
├── runs/exp_demo_baseline/
├── runs/exp_demo_custom/
└── train/loss_demo.csv
```

Settings (Extension Development Host):

| Setting | Default | Purpose |
|---------|---------|---------|
| `vmtb.dataMode` | `mock` | Read `fixtures/` |
| `vmtb.fixturesPath` | *(empty)* | Override fixtures folder |
| `vmtb.goldPath` | *(empty)* | Live Gold path (Phase 4+) |

## Walkthrough (G-UI preview)

1. **Gold** → expand `spare-gold-smoke-v1` → **Scans** → 2 MC scans.
2. Click **Verify Gold** in Gold view welcome / command palette.
3. **Experiments** → `smoke.yaml`, `smoke_dual_film.yaml`.
4. **Runs** → `exp_demo_baseline`, `exp_demo_custom` → expand for `metrics.json`.
5. **Leaderboard** → ranked baselines + demo runs.

Optional: **TestBed: Initialize Workspace** copies `workspace-template/` into your open folder.

## Commands

| Command | ID |
|---------|-----|
| Verify Gold | `vmtb.gold.verify` |
| Initialize Workspace | `vmtb.initWorkspace` |
| Refresh Gold / Experiments / Runs / Leaderboard | `vmtb.gold.refresh`, etc. |

## Verify a task ID (dev team)

From repo root:

```bash
bash scripts/verify-task-id.sh 1.1.6 --push
```

Runs compile → typecheck → unit tests → registry check → git push (only if tests pass).

See [DEV_TEAM_WORKFLOW.md](DEV_TEAM_WORKFLOW.md) and [TASK_REGISTRY.md](TASK_REGISTRY.md).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Sidebar empty / “fixtures not found” | Open **VoxelMapTestBed** repo root as workspace, or set `vmtb.fixturesPath` |
| F5 fails to compile | Run `npm install && npm run compile` |
| AppleDouble `._*` files on T7 | Ignore; real files have no `._` prefix |

## Next phases

- **Phase 1.2+** — checklist, mock run job, webviews  
- **Phase 4** — `vmtb.dataMode: live` + real Gold on T7  
