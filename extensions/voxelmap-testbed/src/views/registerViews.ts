import * as vscode from 'vscode';
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

export function registerSidebarViews(context: vscode.ExtensionContext): void {
  const gold = new GoldTreeProvider();
  const experiments = new ExperimentsTreeProvider();
  const runs = new RunsTreeProvider();
  const leaderboard = new LeaderboardTreeProvider();

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(VIEW.gold, gold),
    vscode.window.registerTreeDataProvider(VIEW.experiments, experiments),
    vscode.window.registerTreeDataProvider(VIEW.runs, runs),
    vscode.window.registerTreeDataProvider(VIEW.leaderboard, leaderboard),
    vscode.commands.registerCommand('vmtb.gold.refresh', () => gold.refresh()),
    vscode.commands.registerCommand('vmtb.experiments.refresh', () =>
      experiments.refresh(),
    ),
    vscode.commands.registerCommand('vmtb.runs.refresh', () => runs.refresh()),
    vscode.commands.registerCommand('vmtb.leaderboard.refresh', () =>
      leaderboard.refresh(),
    ),
  );
}
