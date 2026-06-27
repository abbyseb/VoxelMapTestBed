// Task ID: 1.2.6 — Simulated run job
import { describe, expect, it } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import {
  listWorkspaceRuns,
  mergeRunEntries,
  simulateRunJob,
  workspaceRunsDir,
} from '../run/mockRunJob';
import { RunDataService } from '../run/runDataService';
import { MockDataProvider } from '../data/mockDataProvider';

const FIXTURES = resolve(__dirname, '../../../../fixtures');

describe('1.2.6 mockRunJob', () => {
  const workspace = mkdtempSync(join(tmpdir(), 'vmtb-ws-'));

  it('copies fixture run into workspace runs/', async () => {
    const runId = await simulateRunJob({
      fixturesRoot: FIXTURES,
      workspaceRoot: workspace,
      experimentYaml: 'experiment_id: exp_test\nname: test',
    });
    expect(runId).toMatch(/^exp_mock_/);
    const dest = join(workspaceRunsDir(workspace), runId);
    expect(existsSync(join(dest, 'test', 'metrics.json'))).toBe(true);
    expect(existsSync(join(dest, 'notes.md'))).toBe(true);
    expect(readFileSync(join(dest, 'experiment.yaml'), 'utf8')).toContain('exp_test');
  });

  it('lists workspace runs and merges with fixtures', async () => {
    const wsRuns = listWorkspaceRuns(workspace);
    expect(wsRuns.length).toBeGreaterThan(0);
    const data = new MockDataProvider(FIXTURES);
    const merged = mergeRunEntries(data.listRuns(), wsRuns);
    expect(merged.length).toBeGreaterThan(data.listRuns().length);
  });

  it('RunDataService resolves workspace artifact paths', async () => {
    const data = new MockDataProvider(FIXTURES);
    const service = new RunDataService(data, workspace);
    const wsRun = listWorkspaceRuns(workspace)[0];
    const notes = service.resolveArtifactPath(wsRun.runId, 'notes.md');
    expect(notes).toBeTruthy();
    expect(existsSync(notes!)).toBe(true);
  });

  it('fails when template run missing', async () => {
    await expect(
      simulateRunJob({
        fixturesRoot: FIXTURES,
        workspaceRoot: workspace,
        templateRunId: 'does_not_exist',
        experimentYaml: 'x: 1',
      }),
    ).rejects.toThrow(/Template run not found/);
  });
});
