import * as vscode from 'vscode';
import type { IDataProvider } from '../data/mockDataProvider';
import type { TestBedSession } from '../session/testBedSession';
import { TestBedTreeItem, TestBedTreeProvider } from './baseTreeProvider';

export class ExperimentsTreeProvider extends TestBedTreeProvider {
  constructor(
    private readonly data: IDataProvider,
    private readonly session: TestBedSession,
  ) {
    super();
    session.onDidChange(() => this.refresh());
  }

  getChildren(element?: TestBedTreeItem): TestBedTreeItem[] {
    if (!element) {
      const preview = new TestBedTreeItem(
        'Experiment preview',
        vscode.TreeItemCollapsibleState.Collapsed,
        {
          description: `profile: ${this.session.activeProfileId}`,
          tooltip: 'YAML preview from active Gold profile',
          contextValue: 'experimentPreview',
          iconId: 'output',
        },
      );

      const files = this.data.listExperiments().map(
        (exp) =>
          new TestBedTreeItem(exp.fileName, vscode.TreeItemCollapsibleState.None, {
            description: `profile: ${exp.profile}`,
            tooltip: exp.name,
            contextValue: 'experimentFile',
            iconId: 'file',
            command: {
              command: 'vmtb.experiment.open',
              title: 'Open experiment',
              arguments: [exp.fileName],
            },
          }),
      );

      return [preview, ...files];
    }

    if (element.contextValue === 'experimentPreview') {
      const yaml = this.session.getExperimentYaml();
      const summary = yaml
        .split('\n')
        .filter((line) => line.startsWith('data:') || line.includes('profile:') || line.includes('custom_scans:'))
        .slice(0, 3)
        .join(' · ');

      return [
        new TestBedTreeItem('Open in editor', vscode.TreeItemCollapsibleState.None, {
          description: summary || 'preview.yaml',
          iconId: 'edit',
          command: {
            command: 'vmtb.experiment.edit',
            title: 'Edit experiment preview',
          },
        }),
      ];
    }

    return [];
  }
}
