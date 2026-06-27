import * as vscode from 'vscode';
import { TestBedTreeItem, TestBedTreeProvider } from './baseTreeProvider';

/** Completed experiment runs — placeholder until fixtures/runs (1.1.5). */
export class RunsTreeProvider extends TestBedTreeProvider {
  getChildren(element?: TestBedTreeItem): TestBedTreeItem[] {
    if (!element) {
      return [
        new TestBedTreeItem('exp_demo_baseline', vscode.TreeItemCollapsibleState.Collapsed, {
          description: 'done',
          contextValue: 'runFolder',
          iconId: 'folder-active',
        }),
        new TestBedTreeItem('exp_demo_custom', vscode.TreeItemCollapsibleState.Collapsed, {
          description: 'done',
          contextValue: 'runFolder',
          iconId: 'folder-active',
        }),
      ];
    }

    if (element.contextValue === 'runFolder') {
      return [
        new TestBedTreeItem('experiment.yaml', vscode.TreeItemCollapsibleState.None, {
          iconId: 'file-code',
        }),
        new TestBedTreeItem('notes.md', vscode.TreeItemCollapsibleState.None, {
          iconId: 'markdown',
        }),
        new TestBedTreeItem('metrics.json', vscode.TreeItemCollapsibleState.None, {
          iconId: 'graph',
        }),
        new TestBedTreeItem('test/', vscode.TreeItemCollapsibleState.None, {
          description: 'artifacts',
          iconId: 'folder',
        }),
      ];
    }

    return [];
  }
}
