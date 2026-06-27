import * as vscode from 'vscode';
import type { RunDataService } from '../run/runDataService';
import { TestBedTreeItem, TestBedTreeProvider } from './baseTreeProvider';

export class RunsTreeProvider extends TestBedTreeProvider {
  constructor(private readonly runs: RunDataService) {
    super();
  }

  getChildren(element?: TestBedTreeItem): TestBedTreeItem[] {
    if (!element) {
      return this.runs.listRuns().map(
        (run) =>
          new TestBedTreeItem(run.runId, vscode.TreeItemCollapsibleState.Collapsed, {
            description: run.status,
            tooltip:
              run.meanDice !== undefined
                ? `mean Dice ${run.meanDice.toFixed(3)}`
                : run.runId,
            contextValue: 'runFolder',
            iconId: run.runId.startsWith('exp_mock_') ? 'rocket' : 'folder-active',
          }),
      );
    }

    if (element.contextValue === 'runFolder') {
      const runId = String(element.label);
      return this.runs.listRunArtifacts(runId).map((a) => {
        const iconId =
          a.name.endsWith('.json') ? 'graph' :
          a.name.endsWith('.md') ? 'markdown' :
          a.name.endsWith('.yaml') ? 'file-code' :
          a.kind === 'folder' ? 'folder' : 'file';

        const item = new TestBedTreeItem(a.name, vscode.TreeItemCollapsibleState.None, {
          iconId,
          contextValue: a.name === 'notes.md' ? 'runNotes' : 'runArtifact',
        });
        item.runId = runId;
        item.artifactName = a.name;

        if (a.name === 'notes.md') {
          item.command = {
            command: 'vmtb.notes.open',
            title: 'Open notes',
            arguments: [runId],
          };
          item.description = 'open panel';
        } else if (a.name.endsWith('.yaml') || a.name.endsWith('.json')) {
          item.command = {
            command: 'vmtb.runs.openArtifact',
            title: 'Open file',
            arguments: [runId, a.name],
          };
        }

        return item;
      });
    }

    return [];
  }
}
