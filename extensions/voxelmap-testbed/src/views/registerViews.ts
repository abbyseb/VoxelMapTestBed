import * as vscode from 'vscode';
import { createDataProvider } from '../data/createDataProvider';
import type { IDataProvider } from '../data/mockDataProvider';
import { ExperimentsTreeProvider } from '../providers/experimentsTreeProvider';
import { GoldTreeProvider } from '../providers/goldTreeProvider';
import { LeaderboardTreeProvider } from '../providers/leaderboardTreeProvider';
import { RunsTreeProvider } from '../providers/runsTreeProvider';
import { TestBedSession } from '../session/testBedSession';

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
  session: TestBedSession;
}

function refreshAll(views: SidebarViews): void {
  views.gold.refresh();
  views.experiments.refresh();
  views.runs.refresh();
  views.leaderboard.refresh();
}

export function registerSidebarViews(
  context: vscode.ExtensionContext,
): SidebarViews | undefined {
  const data = createDataProvider(context);
  if (!data) {
    const mode = vscode.workspace.getConfiguration('vmtb').get<string>('dataMode', 'mock');
    const hint =
      mode === 'demo'
        ? 'set vmtb.demoPath to your DEMO folder (e.g. …/DENNIS_BACKUP/DEMO).'
        : 'Open VoxelMapTestBed repo or set vmtb.fixturesPath.';
    void vscode.window.showWarningMessage(`VoxelMap TestBed: data provider not ready — ${hint}`);
    return undefined;
  }

  const session = new TestBedSession(data);
  const gold = new GoldTreeProvider(data, session);
  const experiments = new ExperimentsTreeProvider(data, session);
  const runs = new RunsTreeProvider(data);
  const leaderboard = new LeaderboardTreeProvider(data);
  const views = { gold, experiments, runs, leaderboard, data, session };

  session.onDidChange(() => {
    gold.refresh();
    experiments.refresh();
  });

  const goldView = vscode.window.createTreeView(VIEW.gold, {
    treeDataProvider: gold,
    manageCheckboxStateManually: true,
  });

  goldView.onDidChangeCheckboxState((event) => {
    for (const [item, state] of event.items) {
      if (item.scanId) {
        gold.setScanChecked(
          item.scanId,
          state === vscode.TreeItemCheckboxState.Checked,
        );
      }
    }
  });

  context.subscriptions.push(
    goldView,
    vscode.window.registerTreeDataProvider(VIEW.experiments, experiments),
    vscode.window.registerTreeDataProvider(VIEW.runs, runs),
    vscode.window.registerTreeDataProvider(VIEW.leaderboard, leaderboard),
    vscode.commands.registerCommand('vmtb.gold.refresh', () => refreshAll(views)),
    vscode.commands.registerCommand('vmtb.gold.verify', () => {
      const result = data.verifyGold();
      void vscode.window.showInformationMessage(
        result.ok ? `Gold verify: ${result.message}` : `Gold verify failed: ${result.message}`,
      );
      gold.refresh();
    }),
    vscode.commands.registerCommand('vmtb.gold.filterTags', () => gold.pickTagFilter()),
    vscode.commands.registerCommand('vmtb.gold.clearTagFilter', () => {
      session.checklist.clearTagFilter();
      session.onChecklistChanged();
      gold.refresh();
    }),
    vscode.commands.registerCommand('vmtb.gold.pickProfile', () => gold.pickProfile()),
    vscode.commands.registerCommand('vmtb.gold.applyProfile', (profileId: string) => {
      gold.applyProfile(profileId);
      void vscode.window.showInformationMessage(
        `Profile: ${profileId} — experiment preview updated`,
      );
    }),
    vscode.commands.registerCommand('vmtb.experiment.openPreview', async () => {
      const doc = await vscode.workspace.openTextDocument({
        content: session.getExperimentYaml(),
        language: 'yaml',
      });
      await vscode.window.showTextDocument(doc, { preview: true });
    }),
    vscode.commands.registerCommand('vmtb.experiments.refresh', () =>
      experiments.refresh(),
    ),
    vscode.commands.registerCommand('vmtb.runs.refresh', () => runs.refresh()),
    vscode.commands.registerCommand('vmtb.leaderboard.refresh', () =>
      leaderboard.refresh(),
    ),
  );

  return views;
}
