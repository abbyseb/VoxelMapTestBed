import * as vscode from 'vscode';

/** Shared tree item for all TestBed sidebar views. */
export class TestBedTreeItem extends vscode.TreeItem {
  /** Set on Gold checklist scan rows for checkbox handling. */
  scanId?: string;
  /** Set on Runs artifact rows. */
  runId?: string;
  artifactName?: string;

  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    options?: {
      description?: string;
      tooltip?: string;
      contextValue?: string;
      iconId?: string;
      command?: vscode.Command;
    },
  ) {
    super(label, collapsibleState);
    if (options?.description) {
      this.description = options.description;
    }
    if (options?.tooltip) {
      this.tooltip = options.tooltip;
    }
    if (options?.contextValue) {
      this.contextValue = options.contextValue;
    }
    if (options?.iconId) {
      this.iconPath = new vscode.ThemeIcon(options.iconId);
    }
    if (options?.command) {
      this.command = options.command;
    }
  }
}

export abstract class TestBedTreeProvider
  implements vscode.TreeDataProvider<TestBedTreeItem>
{
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<
    TestBedTreeItem | undefined
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: TestBedTreeItem): TestBedTreeItem {
    return element;
  }

  abstract getChildren(element?: TestBedTreeItem): TestBedTreeItem[];
}
