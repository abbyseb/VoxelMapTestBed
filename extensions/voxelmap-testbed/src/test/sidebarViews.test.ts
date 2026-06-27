// Task ID: 1.1.2 — Sidebar views registration
import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { MockDataProvider } from '../data/mockDataProvider';
import { resolve } from 'node:path';
import { ExperimentsTreeProvider } from '../providers/experimentsTreeProvider';
import { LeaderboardTreeProvider } from '../providers/leaderboardTreeProvider';
import { RunsTreeProvider } from '../providers/runsTreeProvider';
import { TestBedSession } from '../session/testBedSession';
import { RunDataService } from '../run/runDataService';

const FIXTURES = resolve(__dirname, '../../../../fixtures');
const mockData = new MockDataProvider(FIXTURES);

vi.mock('../data/createDataProvider', () => ({
  createDataProvider: () => mockData,
}));

import { registerSidebarViews } from '../views/registerViews';

describe('1.1.2 sidebar views', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers gold tree view and three other tree providers', () => {
    const context = {
      subscriptions: [] as { dispose: () => void }[],
      extensionPath: resolve(__dirname, '../..'),
    } as import('vscode').ExtensionContext;

    const views = registerSidebarViews(context);
    expect(views).toBeDefined();
    expect(vscode.window.createTreeView).toHaveBeenCalledWith(
      'vmtb.gold',
      expect.objectContaining({ manageCheckboxStateManually: true }),
    );
    expect(vscode.window.registerTreeDataProvider).toHaveBeenCalledTimes(3);
  });

  it('registers refresh and verify commands', () => {
    const context = {
      subscriptions: [] as { dispose: () => void }[],
      extensionPath: resolve(__dirname, '../..'),
    } as import('vscode').ExtensionContext;

    registerSidebarViews(context);

    const commands = vi
      .mocked(vscode.commands.registerCommand)
      .mock.calls.map((c) => c[0]);
    expect(commands).toContain('vmtb.gold.refresh');
    expect(commands).toContain('vmtb.gold.verify');
    expect(commands).toContain('vmtb.gold.filterTags');
    expect(commands).toContain('vmtb.gold.pickProfile');
    expect(commands).toContain('vmtb.experiment.run');
    expect(commands).toContain('vmtb.experiments.refresh');
    expect(commands).toContain('vmtb.runs.refresh');
    expect(commands).toContain('vmtb.leaderboard.refresh');
  });

  it('ExperimentsTreeProvider lists preview and fixture experiments', () => {
    const session = new TestBedSession(mockData);
    const p = new ExperimentsTreeProvider(mockData, session);
    const items = p.getChildren();
    expect(items[0].label).toBe('Experiment preview');
    expect(items.some((i) => String(i.label) === 'smoke.yaml')).toBe(true);
  });

  it('RunsTreeProvider lists demo runs from fixtures', () => {
    const runService = new RunDataService(mockData);
    const p = new RunsTreeProvider(runService);
    const items = p.getChildren();
    expect(items.map((i) => i.label)).toContain('exp_demo_baseline');
    expect(items.map((i) => i.label)).toContain('exp_demo_custom');
  });

  it('LeaderboardTreeProvider shows smoke profile rows', () => {
    const p = new LeaderboardTreeProvider(mockData);
    const root = p.getChildren();
    expect(root[0].label).toMatch(/smoke/i);
    const rows = p.getChildren(root[0]);
    expect(rows.length).toBeGreaterThan(0);
  });
});
