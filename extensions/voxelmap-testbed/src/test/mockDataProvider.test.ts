// Task ID: 1.1.6 — MockDataProvider
import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { MockDataProvider } from '../data/mockDataProvider';
import { GoldTreeProvider } from '../providers/goldTreeProvider';
import { TestBedSession } from '../session/testBedSession';
import { RunsTreeProvider } from '../providers/runsTreeProvider';

const FIXTURES = resolve(__dirname, '../../../../fixtures');

describe('1.1.6 MockDataProvider', () => {
  const provider = new MockDataProvider(FIXTURES);

  it('loads manifest from fixtures', () => {
    expect(provider.getPackLabel()).toBe('spare-demo-v1');
    expect(provider.listScans()).toHaveLength(5);
  });

  it('verifyGold passes on fixtures', () => {
    const v = provider.verifyGold();
    expect(v.ok).toBe(true);
  });

  it('lists experiments from fixtures/experiments', () => {
    const exps = provider.listExperiments();
    expect(exps.length).toBeGreaterThanOrEqual(2);
    expect(exps.some((e) => e.fileName === 'smoke.yaml')).toBe(true);
    expect(exps.every((e) => !e.fileName.startsWith('._'))).toBe(true);
  });

  it('lists demo runs with mean dice', () => {
    const runs = provider.listRuns();
    expect(runs.map((r) => r.runId)).toContain('exp_demo_baseline');
    expect(runs.find((r) => r.runId === 'exp_demo_baseline')?.meanDice).toBeGreaterThan(0.9);
  });

  it('leaderboard merges baselines and runs', () => {
    const rows = provider.listLeaderboard('smoke');
    expect(rows.length).toBeGreaterThanOrEqual(4);
  });

  it('GoldTreeProvider reads manifest via MockDataProvider', () => {
    const session = new TestBedSession(provider);
    const tree = new GoldTreeProvider(provider, session);
    const pack = tree.getChildren()[0];
    expect(pack.label).toBe('spare-demo-v1');
    expect(pack.description).toContain('mock');
    const scans = tree
      .getChildren(pack)
      .find((c) => c.label === 'Scans');
    expect(tree.getChildren(scans!).map((s) => s.label)).toContain('MC_V_P1_NS_01');
  });

  it('RunsTreeProvider lists artifact files from fixtures', () => {
    const tree = new RunsTreeProvider(provider);
    const run = tree.getChildren().find((r) => r.label === 'exp_demo_baseline');
    expect(run).toBeDefined();
    const files = tree.getChildren(run!).map((f) => f.label);
    expect(files).toContain('metrics.json');
    expect(files).toContain('notes.md');
  });
});
