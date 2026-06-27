import * as vscode from 'vscode';
import type { IDataProvider } from '../data/mockDataProvider';
import { TestBedTreeItem, TestBedTreeProvider } from './baseTreeProvider';

export class ExperimentsTreeProvider extends TestBedTreeProvider {
  constructor(private readonly data: IDataProvider) {
    super();
  }

  getChildren(element?: TestBedTreeItem): TestBedTreeItem[] {
    if (!element) {
      return this.data.listExperiments().map(
        (exp) =>
          new TestBedTreeItem(exp.fileName, vscode.TreeItemCollapsibleState.None, {
            description: `profile: ${exp.profile}`,
            tooltip: exp.name,
            contextValue: 'experimentFile',
            iconId: 'file',
          }),
      );
    }
    return [];
  }
}
