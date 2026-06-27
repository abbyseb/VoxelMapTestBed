import * as vscode from 'vscode';
import type { IDataProvider } from '../data/mockDataProvider';
import { TestBedTreeItem, TestBedTreeProvider } from './baseTreeProvider';

export class LeaderboardTreeProvider extends TestBedTreeProvider {
  constructor(private readonly data: IDataProvider) {
    super();
  }

  getChildren(element?: TestBedTreeItem): TestBedTreeItem[] {
    if (!element) {
      return [
        new TestBedTreeItem('Profile: smoke', vscode.TreeItemCollapsibleState.Expanded, {
          contextValue: 'leaderboardProfile',
          iconId: 'list-ordered',
        }),
      ];
    }

    if (element.contextValue === 'leaderboardProfile') {
      return this.data.listLeaderboard('smoke').map((row) =>
        new TestBedTreeItem(row.name, vscode.TreeItemCollapsibleState.None, {
          description: `#${row.rank} · ${row.metricLabel}`,
          contextValue: row.isRun ? 'leaderboardRun' : 'leaderboardRow',
          iconId: row.isRun ? 'folder-active' : 'symbol-numeric',
        }),
      );
    }

    return [];
  }
}
