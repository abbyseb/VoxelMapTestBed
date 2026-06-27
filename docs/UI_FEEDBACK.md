# UI feedback — G-UI review log

Track layout and workflow feedback from manual F5 walkthroughs. Phase 2.4 · update after each review session.

**Walkthrough:** [DEV_WORKFLOW.md](DEV_WORKFLOW.md) § Walkthrough  
**Gate:** G-UI (BUILD_PLAN §8.1)

## Review sessions

| Date | Reviewer | Mode | Result |
|------|----------|------|--------|
| 2026-06-27 | agent | mock | Phase 2 started before formal G-UI sign-off — pending human walkthrough |

## Open items (from Phase 1 build)

| Area | Item | Priority | Status |
|------|------|----------|--------|
| Welcome | Quick-start buttons should match final command labels | P2 | open |
| Gold | Demo mode requires `vmtb.demoPath` — surface in Welcome when missing | P1 | open |
| Results | Side-by-side QA vs LEARN-GUI screenshot (metrics layout) | P0 | pending human |
| Runs | Mock run needs workspace folder or repo-root fallback | P2 | mitigated |
| Leaderboard | Baseline names could show experiment profile | P3 | open |
| Train | Live tail vs fixture replay — label when Phase 4 lands | P3 | deferred |

## Resolved

| Date | Item | Resolution |
|------|------|------------|
| 2026-06-27 | AppleDouble `._*` on T7 | Filtered in experiments/runs listing |
| 2026-06-27 | Extension Host with no folder | Mock runs fallback to repo root |

## Phase 2 polish applied

- Activity bar icon + **VoxelMap TestBed** color theme (Preferences → Color Theme)
- Status bar: `TestBed · {mode} · {pack}` — click opens Welcome

## Sign-off

- [ ] Human G-UI walkthrough complete
- [ ] Results layout approved vs LEARN-GUI
- [ ] Ready for Phase 3 (Gold + CLI)
