import * as vscode from 'vscode';
import type { IDataProvider } from '../data/mockDataProvider';
import { TestBedTreeItem, TestBedTreeProvider } from './baseTreeProvider';

export class RunsTreeProvider extends TestBedTreeProvider {
  constructor(private readonly data: IDataProvider) {
    super();
  }

  getChildren(element?: TestBedTreeItem): TestBedTreeItem[] {
    if (!element) {
      return this.data.listRuns().map(
        (run) =>
          new TestBedTreeItem(run.runId, vscode.TreeItemCollapsibleState.Collapsed, {
            description: run.status,
            tooltip:
              run.meanDice !== undefined
                ? `mean Dice ${run.meanDice.toFixed(3)}`
                : run.runId,
            contextValue: 'runFolder',
            iconId: 'folder-active',
          }),
      );
    }

    if (element.contextValue === 'runFolder') {
      const runId = String(element.label);
      return this.data.listRunArtifacts(runId).map((a) => {
        const iconId =
          a.name.endsWith('.json') ? 'graph' :
          a.name.endsWith('.md') ? 'markdown' :
          a.name.endsWith('.yaml') ? 'file-code' :
          a.kind === 'folder' ? 'folder' : 'file';
        return new TestBedTreeItem(a.name, vscode.TreeItemCollapsibleState.None, {
          iconId,
        });
      });
    }

    return [];
  }
}
