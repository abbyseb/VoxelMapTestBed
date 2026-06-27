# VSCodium Build Fork — VoxelMap TestBed

**Decision:** Ship **VoxelMap TestBed** as a custom [VSCodium](https://vscodium.com/) distribution (MIT), not a fork of [microsoft/vscode](https://github.com/microsoft/vscode) source.

## What we fork

| Fork | Repo | Customize |
|------|------|-----------|
| **Build & packaging** | [VSCodium/vscodium](https://github.com/VSCodium/vscodium) | `product.json`, icons, bundled VSIX, feature trim |
| **Product logic** | `extensions/voxelmap-testbed/` | Gold UI, benchmarks, webviews |
| **Do not fork** | VS Code `src/vs/*` | Avoid unless blocking issue |

## product.json (key fields)

- `nameShort` / `nameLong`: VoxelMap TestBed
- `applicationName`: voxelmap-testbed
- `darwinBundleIdentifier`: com.voxelmap.testbed
- `urlProtocol`: voxelmap-testbed
- `extensionsGallery`: Open VSX (default VSCodium)
- Bundled extension: inject `voxelmap-testbed.vsix` in build script

See VSCodium docs on [how to build](https://github.com/VSCodium/vscodium/blob/master/docs/howto-build.md).

## Release naming

```
VoxelMapTestBed-{testbed_version}+vscodium{upstream_version}
Example: 1.0.0+vscodium1.96.2
```

## Rebase procedure (monthly/quarterly)

1. Fetch upstream VSCodium tag matching target VS Code release.
2. Merge into `vscodium-build/`; resolve `product.json` conflicts.
3. Rebuild `extensions/voxelmap-testbed` VSIX.
4. Run `scripts/build-ide.sh` on macOS + Linux CI.
5. Smoke test: Gold verify → smoke benchmark → Results webview.
6. Tag release + release notes.

## Feature trim (initial)

Document each disabled built-in or marketplace default in this file when applied.

- Generic welcome / tips → replace with TestBed welcome webview
- Microsoft marketplace → Open VSX only (VSCodium default)
- Optional: hide Remote / Copilot entries if present in build

## Dev workflow (before branded build)

1. Install VSCodium from [vscodium.com](https://vscodium.com/).
2. `cd extensions/voxelmap-testbed && npm run compile`
3. F5 → Extension Development Host.
4. Backend: `uvicorn backend.api.main` or `vmtb serve`.

## Installers

| Platform | Artifact |
|----------|----------|
| macOS | `.dmg` |
| Linux | `.AppImage` / `.deb` |
| Windows | `.exe` (SignPath or equivalent) |

Gold data remains a **local folder** (e.g. T7 path) — not in the IDE installer. **Local desktop only** — no web/code-server/Docker.

## Related docs

- [BUILD_PLAN.md](../BUILD_PLAN.md) — full product plan (§2 VSCodium architecture)
- [SPARE Public Archive README](../SPARE_PublicArchive/README.md) — Gold dataset reference
