import * as vscode from 'vscode';
import { TestBedTreeItem, TestBedTreeProvider } from './baseTreeProvider';

/** Baseline + run ranking — placeholder until fixtures/baselines (1.3.5). */
export class LeaderboardTreeProvider extends TestBedTreeProvider {
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
      return [
        row('1', 'concat + FiLM (baseline)', '0.912 Dice'),
        row('2', 'exp_demo_custom', '0.905 Dice'),
        row('3', 'dual + FiLM (baseline)', '0.898 Dice'),
        row('—', '… 5 more baselines', 'stub'),
      ];
    }

    return [];
  }
}

function row(rank: string, name: string, metric: string): TestBedTreeItem {
  return new TestBedTreeItem(name, vscode.TreeItemCollapsibleState.None, {
    description: `#${rank} · ${metric}`,
    contextValue: 'leaderboardRow',
    iconId: 'symbol-numeric',
  });
}
