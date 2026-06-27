// Task ID: 1.1.2 — Sidebar views registration
import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { MockDataProvider } from '../data/mockDataProvider';
import { resolve } from 'node:path';
import { ExperimentsTreeProvider } from '../providers/experimentsTreeProvider';
import { LeaderboardTreeProvider } from '../providers/leaderboardTreeProvider';
import { RunsTreeProvider } from '../providers/runsTreeProvider';

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

  it('registers four tree data providers when fixtures available', () => {
    const context = {
      subscriptions: [] as { dispose: () => void }[],
      extensionPath: resolve(__dirname, '../..'),
    } as import('vscode').ExtensionContext;

    const views = registerSidebarViews(context);
    expect(views).toBeDefined();
    expect(vscode.window.registerTreeDataProvider).toHaveBeenCalledTimes(4);
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
    expect(commands).toContain('vmtb.experiments.refresh');
    expect(commands).toContain('vmtb.runs.refresh');
    expect(commands).toContain('vmtb.leaderboard.refresh');
  });

  it('ExperimentsTreeProvider lists fixture experiments', () => {
    const p = new ExperimentsTreeProvider(mockData);
    const items = p.getChildren();
    expect(items.some((i) => String(i.label) === 'smoke.yaml')).toBe(true);
  });

  it('RunsTreeProvider lists demo runs from fixtures', () => {
    const p = new RunsTreeProvider(mockData);
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
