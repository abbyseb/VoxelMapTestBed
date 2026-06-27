# VoxelMap TestBed — Development team workflow

Three roles, one pipeline. Applies to **every BUILD_PLAN task ID**.

## Roles

1. **Developer** — writes the feature; keeps scope minimal  
2. **Tester** — adds automated unit tests as code lands  
3. **QA / QC** — verifies, updates registry, **pushes to git only if tests pass**

## Commands

```bash
# Close a task ID (verify + commit + push) — ONLY runs push if tests pass
bash scripts/verify-task-id.sh 1.1.3 --push

# Verify without git (debugging)
bash scripts/verify-task-id.sh 1.1.3

# Extension only (during development)
cd extensions/voxelmap-testbed
npm run compile && npm run check-types && npm test
```

## Git rule (locked)

| Condition | Action |
|-----------|--------|
| Tests **pass** | `verify-task-id.sh <ID> --push` → commit + `git push` |
| Tests **fail** | **Never push** — fix code/tests first |
| No `--push` flag | Verify only; no commit/push |

Commit message format (auto-generated):

```
task(1.1.3): Sample workspace template

Verified: compile, typecheck, and unit tests pass.
```

## Artifacts

| File | Purpose |
|------|---------|
| [BUILD_PLAN.md](../BUILD_PLAN.md) | What to build (task IDs) |
| [TASK_REGISTRY.md](TASK_REGISTRY.md) | What's verified |
| [.cursor/skills/voxelmap-dev-team/SKILL.md](../.cursor/skills/voxelmap-dev-team/SKILL.md) | Agent skill |
| [TASK_CRITERIA.md](../.cursor/skills/voxelmap-dev-team/TASK_CRITERIA.md) | QA acceptance per ID |
| [scripts/verify-task-id.sh](../scripts/verify-task-id.sh) | Verify + optional push |

## Rule

**No task ID is complete without:**

- Automated test(s) (unless marked optional)  
- `verify-task-id.sh <ID> --push` exit 0  
- Registry row with `verified: yes`  
- Changes on `origin/main` (or feature branch)
