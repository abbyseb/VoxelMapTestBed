import * as vscode from 'vscode';
import { TestBedTreeItem, TestBedTreeProvider } from './baseTreeProvider';

/** Experiment YAML specs in workspace — placeholder until 1.1.3. */
export class ExperimentsTreeProvider extends TestBedTreeProvider {
  getChildren(element?: TestBedTreeItem): TestBedTreeItem[] {
    if (!element) {
      return [
        new TestBedTreeItem('smoke.yaml', vscode.TreeItemCollapsibleState.None, {
          description: 'profile: smoke',
          tooltip: 'Concat + FiLM baseline (stub)',
          contextValue: 'experimentFile',
          iconId: 'file',
        }),
        new TestBedTreeItem('smoke_dual_film.yaml', vscode.TreeItemCollapsibleState.None, {
          description: 'dual arch',
          tooltip: 'Second experiment stub for compare',
          contextValue: 'experimentFile',
          iconId: 'file',
        }),
      ];
    }
    return [];
  }
}
