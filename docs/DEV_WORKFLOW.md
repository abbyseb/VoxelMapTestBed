# VoxelMap TestBed — Developer workflow

Run the extension in **mock** or **demo** mode — no Gold prep pipeline or GPU required.

## Prerequisites

1. Install [VSCodium](https://vscodium.com/) (or VS Code).
2. Clone [VoxelMapTestBed](https://github.com/abbyseb/VoxelMapTestBed.git).

## Open the project

**Option A — whole repo (recommended):**

```
File → Open Folder → …/VoxelMapTestBed
```

**Option B — extension only:**

```
File → Open Folder → …/VoxelMapTestBed/extensions/voxelmap-testbed
```

Install dependencies once:

```bash
cd extensions/voxelmap-testbed
npm install
```

## F5 — Launch the TestBed

1. Open **Run and Debug** (play icon with bug, left sidebar) or press **F5**.
2. Select **Run VoxelMap TestBed** (repo root) or **Run Extension** (if you opened `extensions/voxelmap-testbed`).
3. A **new window** opens titled **[Extension Development Host]** — that is the app.
4. Click the **cube icon** on the left activity bar → Gold / Experiments / Runs / Leaderboard.

The repo includes `.vscode/settings.json` with **demo mode** and your T7 DEMO path, so Gold should show **demo ✓** after F5 (not `mock`).

**Can't find settings?** They live in the **Extension Development Host** window (step 3), not the window where you pressed F5:

1. Focus the **[Extension Development Host]** window.
2. `Cmd+,` → search **vmtb**.
3. Set `vmtb.dataMode` = `demo`, `vmtb.demoPath` = `/Volumes/T7 Shield/DENNIS_BACKUP/DEMO`.
4. Command Palette → **Developer: Reload Window**.

If Gold still shows **mock**, reload the Extension Development Host window.

## Data modes (Phase 1)

### Mock (default)

Reads `fixtures/` only — synthetic manifest + demo run metrics.

### Demo (real preprocessed cases on T7)

Use preprocessed SPARE cases under `DENNIS_BACKUP/DEMO` for the Gold tree; runs/experiments still come from `fixtures/`.

In the Extension Development Host, open **Settings** and set:

| Setting | Example |
|---------|---------|
| `vmtb.dataMode` | `demo` |
| `vmtb.demoPath` | `/Volumes/T7 Shield/DENNIS_BACKUP/DEMO` |

Reload the window. Gold should show `spare-demo-v1` with **demo ✓** and five scans.

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

All settings:

| Setting | Default | Purpose |
|---------|---------|---------|
| `vmtb.dataMode` | `mock` | `mock` = fixtures only; `demo` = DEMO cases + fixtures runs |
| `vmtb.demoPath` | *(empty)* | Preprocessed DEMO folder (required for demo mode) |
| `vmtb.fixturesPath` | *(empty)* | Override fixtures folder |
| `vmtb.goldPath` | *(empty)* | Live Gold path (Phase 4+) |

## Walkthrough (G-UI preview)

1. **Gold** → expand `spare-demo-v1` → **Checklist** → check/uncheck scans; click **Tag filter** or the filter icon in the view title.
2. Click **Verify Gold** in Gold view welcome / command palette.
3. **Experiments** → `smoke.yaml`, `smoke_dual_film.yaml`.
4. **Runs** → `exp_demo_baseline`, `exp_demo_custom` → expand for `metrics.json`.
5. **Leaderboard** → ranked baselines + demo runs.

Optional: **TestBed: Initialize Workspace** copies `workspace-template/` into your open folder.

## Commands

| Command | ID |
|---------|-----|
| Verify Gold | `vmtb.gold.verify` |
| Filter Gold tags | `vmtb.gold.filterTags` |
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
| Demo mode empty | Set `vmtb.dataMode` to `demo` and `vmtb.demoPath` to your DEMO folder |
| F5 fails to compile | Run `npm install && npm run compile` |
| AppleDouble `._*` files on T7 | Ignore; real files have no `._` prefix |

## Next phases

- **Phase 1.2+** — checklist, mock run job, webviews  
- **Phase 4** — `vmtb.dataMode: live` + real Gold on T7  
