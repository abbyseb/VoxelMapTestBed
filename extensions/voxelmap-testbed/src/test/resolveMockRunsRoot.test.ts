// Task ID: 1.2.6 — mock runs workspace resolution
import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { resolveMockRunsRoot } from '../workspace/resolveMockRunsRoot';

const REPO = resolve(__dirname, '../../../../');
const EXT = resolve(__dirname, '../..');

describe('resolveMockRunsRoot', () => {
  it('prefers open workspace folder', () => {
    const r = resolveMockRunsRoot({
      workspaceFolder: '/tmp/my-project',
      extensionPath: EXT,
    });
    expect(r).toEqual({ root: '/tmp/my-project', source: 'workspace' });
  });

  it('falls back to monorepo root when no workspace', () => {
    const r = resolveMockRunsRoot({
      extensionPath: EXT,
    });
    expect(r?.source).toBe('repo');
    expect(r?.root).toBe(REPO);
  });

  it('uses vmtb.mockRunsWorkspace override when set', () => {
    const r = resolveMockRunsRoot({
      extensionPath: EXT,
      settingOverride: REPO,
    });
    expect(r).toEqual({ root: REPO, source: 'setting' });
  });
});
