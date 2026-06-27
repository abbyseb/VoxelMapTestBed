// Task ID: 1.1.2 — Sidebar views registration
import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { registerSidebarViews } from '../views/registerViews';
import { ExperimentsTreeProvider } from '../providers/experimentsTreeProvider';
import { LeaderboardTreeProvider } from '../providers/leaderboardTreeProvider';
import { RunsTreeProvider } from '../providers/runsTreeProvider';

describe('1.1.2 sidebar views', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers four tree data providers', () => {
    const context = {
      subscriptions: [] as { dispose: () => void }[],
    } as import('vscode').ExtensionContext;

    registerSidebarViews(context);

    const viewIds = vi
      .mocked(vscode.window.registerTreeDataProvider)
      .mock.calls.map((c) => c[0]);
    expect(viewIds).toEqual([
      'vmtb.gold',
      'vmtb.experiments',
      'vmtb.runs',
      'vmtb.leaderboard',
    ]);
  });

  it('registers refresh commands', () => {
    const context = {
      subscriptions: [] as { dispose: () => void }[],
    } as import('vscode').ExtensionContext;

    registerSidebarViews(context);

    const commands = vi
      .mocked(vscode.commands.registerCommand)
      .mock.calls.map((c) => c[0]);
    expect(commands).toContain('vmtb.gold.refresh');
    expect(commands).toContain('vmtb.experiments.refresh');
    expect(commands).toContain('vmtb.runs.refresh');
    expect(commands).toContain('vmtb.leaderboard.refresh');
  });

  it('ExperimentsTreeProvider lists stub experiments', () => {
    const p = new ExperimentsTreeProvider();
    const items = p.getChildren();
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items.some((i) => String(i.label).includes('smoke'))).toBe(true);
  });

  it('RunsTreeProvider lists demo runs', () => {
    const p = new RunsTreeProvider();
    const items = p.getChildren();
    expect(items.map((i) => i.label)).toContain('exp_demo_baseline');
    expect(items.map((i) => i.label)).toContain('exp_demo_custom');
  });

  it('LeaderboardTreeProvider shows smoke profile', () => {
    const p = new LeaderboardTreeProvider();
    const root = p.getChildren();
    expect(root[0].label).toMatch(/smoke/i);
  });
});
