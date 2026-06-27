import * as fs from 'node:fs';
import * as path from 'node:path';

/** Resolve where mock runs/ are written: workspace folder, setting, or monorepo root. */
export function resolveMockRunsRoot(options: {
  workspaceFolder?: string;
  extensionPath: string;
  settingOverride?: string;
}): { root: string; source: 'workspace' | 'setting' | 'repo' } | undefined {
  const override = options.settingOverride?.trim();
  if (override && fs.existsSync(override)) {
    return { root: override, source: 'setting' };
  }

  if (options.workspaceFolder) {
    return { root: options.workspaceFolder, source: 'workspace' };
  }

  const repoRoot = path.join(options.extensionPath, '..', '..');
  if (fs.existsSync(path.join(repoRoot, 'fixtures', 'manifest.yaml'))) {
    return { root: repoRoot, source: 'repo' };
  }

  return undefined;
}
