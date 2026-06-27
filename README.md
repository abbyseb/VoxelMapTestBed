# VoxelMap TestBed

Developer benchmark harness for VoxelMap / SPARE — local desktop IDE (VSCodium-based) with Gold packs, pluggable models, and LEARN-GUI–quality visualization.

**Start here:** [BUILD_PLAN.md](BUILD_PLAN.md)

## Docs

- [BUILD_PLAN.md](BUILD_PLAN.md) — product architecture and phased roadmap
- [docs/VSCODIUM_FORK.md](docs/VSCODIUM_FORK.md) — VSCodium build fork notes
- [docs/DEV_TEAM_WORKFLOW.md](docs/DEV_TEAM_WORKFLOW.md) — Developer → Tester → QA/QC process
- [docs/TASK_REGISTRY.md](docs/TASK_REGISTRY.md) — task ID verification status

## Quality

Every BUILD_PLAN task ID requires unit tests + verification:

```bash
bash scripts/verify-task-id.sh 1.1.2 --push   # push only if tests pass
```

Agent skill: `.cursor/skills/voxelmap-dev-team/SKILL.md`

## Status

Phase 1 (Visual TestBed on mock fixtures) — planning complete; implementation next.
