// Task ID: 1.3.7 — Result / leaderboard / train commands
import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { MockDataProvider } from '../data/mockDataProvider';
import { resolve } from 'node:path';
import { RunDataService } from '../run/runDataService';

const FIXTURES = resolve(__dirname, '../../../../fixtures');
const mockData = new MockDataProvider(FIXTURES);

vi.mock('../data/createDataProvider', () => ({
  createDataProvider: () => mockData,
}));

import { registerSidebarViews } from '../views/registerViews';

describe('1.3.7 webview commands', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers results, leaderboard, and train open commands', () => {
    const context = {
      subscriptions: [] as { dispose: () => void }[],
      extensionPath: resolve(__dirname, '../..'),
      extensionUri: { fsPath: resolve(__dirname, '../..') },
    } as import('vscode').ExtensionContext;

    registerSidebarViews(context);

    const commands = vi
      .mocked(vscode.commands.registerCommand)
      .mock.calls.map((c) => c[0]);
    expect(commands).toContain('vmtb.results.open');
    expect(commands).toContain('vmtb.leaderboard.open');
    expect(commands).toContain('vmtb.train.open');
  });

  it('RunDataService resolves fixture run root for results', () => {
    const svc = new RunDataService(mockData);
    expect(svc.resolveRunRoot('exp_demo_baseline')).toContain('exp_demo_baseline');
  });
});
