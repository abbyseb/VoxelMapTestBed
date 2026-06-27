import * as vscode from 'vscode';
import { createDataProvider } from '../data/createDataProvider';
import type { IDataProvider } from '../data/mockDataProvider';
import { ExperimentsTreeProvider } from '../providers/experimentsTreeProvider';
import { GoldTreeProvider } from '../providers/goldTreeProvider';
import { LeaderboardTreeProvider } from '../providers/leaderboardTreeProvider';
import { RunsTreeProvider } from '../providers/runsTreeProvider';

const VIEW = {
  gold: 'vmtb.gold',
  experiments: 'vmtb.experiments',
  runs: 'vmtb.runs',
  leaderboard: 'vmtb.leaderboard',
} as const;

export interface SidebarViews {
  gold: GoldTreeProvider;
  experiments: ExperimentsTreeProvider;
  runs: RunsTreeProvider;
  leaderboard: LeaderboardTreeProvider;
  data: IDataProvider;
}

export function registerSidebarViews(
  context: vscode.ExtensionContext,
): SidebarViews | undefined {
  const data = createDataProvider(context);
  if (!data) {
    void vscode.window.showWarningMessage(
      'VoxelMap TestBed: fixtures not found. Open VoxelMapTestBed repo or set vmtb.fixturesPath.',
    );
    return undefined;
  }

  const gold = new GoldTreeProvider(data);
  const experiments = new ExperimentsTreeProvider(data);
  const runs = new RunsTreeProvider(data);
  const leaderboard = new LeaderboardTreeProvider(data);

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(VIEW.gold, gold),
    vscode.window.registerTreeDataProvider(VIEW.experiments, experiments),
    vscode.window.registerTreeDataProvider(VIEW.runs, runs),
    vscode.window.registerTreeDataProvider(VIEW.leaderboard, leaderboard),
    vscode.commands.registerCommand('vmtb.gold.refresh', () => {
      gold.refresh();
      experiments.refresh();
      runs.refresh();
      leaderboard.refresh();
    }),
    vscode.commands.registerCommand('vmtb.gold.verify', () => {
      const result = data.verifyGold();
      void vscode.window.showInformationMessage(
        result.ok ? `Gold verify: ${result.message}` : `Gold verify failed: ${result.message}`,
      );
      gold.refresh();
    }),
    vscode.commands.registerCommand('vmtb.experiments.refresh', () =>
      experiments.refresh(),
    ),
    vscode.commands.registerCommand('vmtb.runs.refresh', () => runs.refresh()),
    vscode.commands.registerCommand('vmtb.leaderboard.refresh', () =>
      leaderboard.refresh(),
    ),
  );

  return { gold, experiments, runs, leaderboard, data };
}
