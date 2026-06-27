# VoxelMap TestBed — Task verification registry

Every BUILD_PLAN task ID must be listed here before marking **verified: yes**.

**Process:** [.cursor/skills/voxelmap-dev-team/SKILL.md](../.cursor/skills/voxelmap-dev-team/SKILL.md)  
**Verify:** `bash scripts/verify-task-id.sh <ID>`

## Gates

| Gate | Status | Notes |
|------|--------|-------|
| G-UI | pending | Requires all 1.1.*–1.3.* verified + manual F5 walkthrough |
| G0 | pending | Phase 3 |
| G-Live | pending | Phase 4 |

## Phase 1.1

| ID | Description | Status | Tests | Verified | Date | Verifier |
|----|-------------|--------|-------|----------|------|----------|
| 1.1.1 | Extension scaffold | implemented | extension.scaffold.test.ts | yes | 2026-06-27 | agent |
| 1.1.2 | Activity bar + sidebar views | implemented | goldTreeProvider.test.ts, sidebarViews.test.ts | yes | 2026-06-27 | agent |
| 1.1.3 | Sample workspace template | implemented | workspaceTemplate.test.ts | yes | 2026-06-27 | agent |
| 1.1.4 | fixtures/manifest.yaml | implemented | manifest.test.ts | yes | 2026-06-27 | agent |
| 1.1.5 | fixtures/runs exp_demo_* | implemented | fixturesRuns.test.ts | yes | 2026-06-27 | agent |
| 1.1.6 | MockDataProvider | implemented | mockDataProvider.test.ts | yes | 2026-06-27 | agent |
| 1.1.7 | DEV_WORKFLOW.md | implemented | optional | yes | 2026-06-27 | agent |

## Phase 1.2

| ID | Description | Status | Tests | Verified | Date | Verifier |
|----|-------------|--------|-------|----------|------|----------|
| 1.2.1 | Gold tree from manifest | implemented | goldTreeProvider.test.ts, demoScans.test.ts, demoDataProvider.test.ts | yes | 2026-06-27 | agent |
| 1.2.2 | Scan checklist | implemented | goldChecklist.test.ts, goldTreeProvider.test.ts | yes | 2026-06-27 | agent |
| 1.2.3 | Profile picker | implemented | profiles.test.ts | yes | 2026-06-27 | agent |
| 1.2.4 | Experiment editor | implemented | experimentEditor.test.ts | yes | 2026-06-27 | agent |
| 1.2.5 | Notes panel | implemented | notesPanel.test.ts | yes | 2026-06-27 | agent |
| 1.2.6 | Simulated run job | implemented | mockRunJob.test.ts | yes | 2026-06-27 | agent |
| 1.2.7 | Welcome webview | implemented | welcomeWebview.test.ts | yes | 2026-06-27 | agent |

## Phase 1.3

| ID | Description | Status | Tests | Verified | Date | Verifier |
|----|-------------|--------|-------|----------|------|----------|
| 1.3.1 | Webview build pipeline | implemented | webviews.build.test.ts | yes | 2026-06-27 | agent |
| 1.3.2 | ResultsViewer | implemented | resultsViewer.test.ts | yes | 2026-06-27 | agent |
| 1.3.3 | Polar gantry plot | implemented | gantryPlot.test.ts | yes | 2026-06-27 | agent |
| 1.3.4 | Performance trace | implemented | performanceTrace.test.ts | yes | 2026-06-27 | agent |
| 1.3.5 | Leaderboard webview | implemented | leaderboard.test.ts | yes | 2026-06-27 | agent |
| 1.3.6 | TrainMonitor | implemented | trainMonitor.test.ts | yes | 2026-06-27 | agent |
| 1.3.7 | Result commands | implemented | commands.test.ts | yes | 2026-06-27 | agent |
| 1.3.8 | build-extension.sh | implemented | optional | yes | 2026-06-27 | agent |

## Phase 2

| ID | Description | Status | Tests | Verified | Date | Verifier |
|----|-------------|--------|-------|----------|------|----------|
| 2.1 | Icon + color theme | implemented | brandResources.test.ts | yes | 2026-06-27 | agent |
| 2.2 | Status bar mode + pack | implemented | statusBar.test.ts | yes | 2026-06-27 | agent |
| 2.3 | Draft product.json | implemented | productJson.test.ts | yes | 2026-06-27 | agent |
| 2.4 | UI feedback doc | implemented | uiFeedback.test.ts | yes | 2026-06-27 | agent |

---
