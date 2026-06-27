---
name: voxelmap-dev-team
description: >-
  VoxelMap TestBed development team workflow — Developer, Tester, QA/QC roles;
  unit tests and verification for every BUILD_PLAN task ID (1.1.1, 1.1.2, G-UI, etc.).
  Use when implementing a task ID, marking work done, adding tests, running verify,
  or when the user mentions dev team, QA, QC, unit tests, or task verification.
---

# VoxelMap TestBed — Development Team Skill

Treat every **BUILD_PLAN task ID** as a mini release. Three roles run in order; **nothing is “done” until QA signs off and tests pass**.

**Source of truth:** [BUILD_PLAN.md](../../BUILD_PLAN.md) §8 · **Registry:** [docs/TASK_REGISTRY.md](../../docs/TASK_REGISTRY.md)

---

## Roles (run in order)

| Role | Responsibility | Must produce |
|------|----------------|--------------|
| **Developer** | Implement the task ID scope only; match existing patterns | Code + brief dev note in registry |
| **Tester** | Add/update **automated unit tests** for new/changed behavior | Tests in `extensions/voxelmap-testbed/src/test/` (or `backend/tests/` later) |
| **QA / QC** | Run verification, check acceptance criteria, update registry, **git push if tests pass** | `verified: yes` + date; commit on `origin` |

The agent may play all three roles in one session, but **must not skip Tester or QA**.

**Git rule (locked):** Push to `origin` **only** via `verify-task-id.sh <ID> --push` after tests pass. **Never push** if compile, typecheck, or unit tests fail.

---

## Workflow (every task ID)

```
Task ID requested or completed (e.g. 1.1.2)
        │
        ▼
┌───────────────┐
│ 1. DEVELOPER  │  Implement · compile · minimal manual smoke
└───────┬───────┘
        ▼
┌───────────────┐
│ 2. TESTER     │  Add unit tests · npm test · cover happy path + one edge case
└───────┬───────┘
        ▼
┌───────────────┐
│ 3. QA / QC    │  verify-task-id.sh <ID> --push · registry · gate check
└───────────────┘
        │
        ▼ (only if tests pass)
   git commit + git push
```

### Developer checklist

- [ ] Scope matches **only** the task ID row in BUILD_PLAN (no drive-by refactors)
- [ ] `npm run compile` and `npm run check-types` pass in affected package
- [ ] No secrets, no `node_modules` committed
- [ ] Registry row added/updated: status `implemented`

### Tester checklist

- [ ] New test file named `*.test.ts` under `src/test/` (extension) or `tests/` (backend)
- [ ] Test file header comment: `// Task ID: x.y.z`
- [ ] Tests run headless: `npm test` (no F5 required for CI)
- [ ] Registry: `tests` column lists test file(s)

### QA / QC checklist

- [ ] Registry: `verified: yes`, date, verifier (`agent` or human)
- [ ] All acceptance bullets for that ID in [TASK_CRITERIA.md](TASK_CRITERIA.md) checked
- [ ] Run: `bash scripts/verify-task-id.sh <TASK_ID> --push` from repo root
- [ ] **If and only if** tests pass: script commits + pushes; **never push on failure**
- [ ] If task belongs to a **gate** (G-UI, G0, …), note gate progress in registry

---

## Verification command

From repo root:

```bash
# Verify only (no git)
bash scripts/verify-task-id.sh 1.1.2

# Verify + commit + push (required to close a task ID)
bash scripts/verify-task-id.sh 1.1.2 --push
```

Script order: compile → typecheck → unit tests → registry → **(optional) git commit + push**.

Exit `0` = QA pass. Push runs **only** when all prior steps succeed.

---

## Test stack (extension — Phase 1)

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit tests for providers, mock data, pure functions |
| `@vitest/coverage-v8` | Optional coverage (aim ≥80% on new files) |
| `src/test/mocks/vscode.ts` | Minimal `vscode` API mock |

Add to `package.json`:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

**Backend (Phase 3+):** pytest under `backend/tests/`, invoked from `verify-task-id.sh` when `backend/` exists.

---

## When to add tests

| Change type | Minimum tests |
|-------------|----------------|
| New tree provider / view | `getChildren` root + nested nodes |
| New command | Command registered (mock `registerCommand`) |
| MockDataProvider / fixture loader | Parse manifest, missing file, bad yaml |
| Webview data transform | Pure function unit tests (no DOM if possible) |
| CLI `vmtb` | pytest subprocess or Click runner |

**Rule:** If you touch it, you test it. No task ID closed without at least one new or updated test **unless** TASK_CRITERIA marks `tests: optional` (docs-only tasks).

---

## Task ID format

- Phase 1: `1.1.1` … `1.3.8`, gate `G-UI`
- Phase 2: `2.1` … `2.4`
- Phase 3+: `3.1.1`, etc.

Always use the **exact ID** from BUILD_PLAN tables.

---

## Registry update template

After QA pass, append or update in [docs/TASK_REGISTRY.md](../../docs/TASK_REGISTRY.md):

```markdown
| 1.1.2 | Activity bar + sidebar views | implemented | goldTreeProvider.test.ts, views.test.ts | yes | 2026-06-27 | agent |
```

---

## Gate verification

| Gate | When | QA action |
|------|------|-----------|
| **G-UI** | All 1.1.*–1.3.* verified | Run manual walkthrough doc + all Phase 1 tests |
| **G0** | Phase 3 complete | `vmtb run` smoke + pytest |
| **G-Live** | Phase 4 complete | Extension live mode + integration test |

Document gate status in TASK_REGISTRY **Gates** section.

---

## Failure handling

If `verify-task-id.sh` fails (any step before push):

1. **Do not run `--push`** and **do not git push manually**
2. **Tester** fixes tests or **Developer** fixes code
3. Re-run `bash scripts/verify-task-id.sh <ID> --push`
4. Do **not** mark registry `verified: yes` until exit 0

---

## Additional resources

- Acceptance criteria per ID: [TASK_CRITERIA.md](TASK_CRITERIA.md)
- Human-readable process: [docs/DEV_TEAM_WORKFLOW.md](../../docs/DEV_TEAM_WORKFLOW.md)
