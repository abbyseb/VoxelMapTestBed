# Task acceptance criteria (QA reference)

QA uses this with [TASK_REGISTRY.md](../../docs/TASK_REGISTRY.md) and `scripts/verify-task-id.sh`.

## Phase 1.1 — Editor shell + fixtures

| ID | Acceptance criteria | Required tests |
|----|---------------------|----------------|
| **1.1.1** | `extensions/voxelmap-testbed/` exists; `npm run compile` + `check-types` pass; extension activates | `extension.scaffold.test.ts` |
| **1.1.2** | Activity bar container `voxelmap-testbed`; views `vmtb.gold`, `vmtb.experiments`, `vmtb.runs`, `vmtb.leaderboard`; refresh commands | `goldTreeProvider.test.ts`, `sidebarViews.test.ts` |
| **1.1.3** | `workspace-template/models/custom/`, `experiments/smoke.yaml` | `workspaceTemplate.test.ts` |
| **1.1.4** | `fixtures/manifest.yaml` valid; 2 scans; matches BUILD_PLAN §3.4 shape | `manifest.test.ts` |
| **1.1.5** | `fixtures/runs/exp_demo_*` with metrics.json, notes, experiment.yaml | `fixturesRuns.test.ts` |
| **1.1.6** | `MockDataProvider`; `vmtb.dataMode: mock`; trees read fixtures | `mockDataProvider.test.ts` |
| **1.1.7** | `docs/DEV_WORKFLOW.md`; F5 steps documented | docs-only · `tests: optional` |

## Phase 1.2 — Gold browser + experiment flow

| ID | Acceptance criteria | Required tests |
|----|---------------------|----------------|
| **1.2.1** | Gold tree reads manifest; mock badge | `goldTreeProvider.test.ts` (update) |
| **1.2.2** | Checklist + tag filter | `goldChecklist.test.ts` |
| **1.2.3** | Profile picker smoke/custom | `profiles.test.ts` |
| **1.2.4** | Experiment yaml editor | `experimentEditor.test.ts` |
| **1.2.5** | Notes panel | `notesPanel.test.ts` |
| **1.2.6** | Simulated run job | `mockRunJob.test.ts` |
| **1.2.7** | Welcome webview | `welcomeWebview.test.ts` |

## Phase 1.3 — P0 webviews

| ID | Acceptance criteria | Required tests |
|----|---------------------|----------------|
| **1.3.1** | Webview build pipeline | `webviews.build.test.ts` |
| **1.3.2** | ResultsViewer metrics parse | `resultsViewer.test.ts` |
| **1.3.3** | Polar gantry plot data | `gantryPlot.test.ts` |
| **1.3.4** | Performance trace asset load | `performanceTrace.test.ts` |
| **1.3.5** | Leaderboard baselines | `leaderboard.test.ts` |
| **1.3.6** | TrainMonitor CSV tail | `trainMonitor.test.ts` |
| **1.3.7** | Commands vmtb.results.open etc. | `commands.test.ts` |
| **1.3.8** | `scripts/build-extension.sh` produces .vsix | `tests: optional` (shell smoke) |

## Gates

| Gate | Criteria |
|------|----------|
| **G-UI** | All 1.1.*–1.3.* verified; manual F5 walkthrough per BUILD_PLAN §8.1 |

## Docs-only / optional test tasks

Mark `tests: optional` in registry; QA still runs compile + typecheck + script.
