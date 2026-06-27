import * as vscode from 'vscode';
import type { IDataProvider } from '../data/mockDataProvider';
import { TestBedTreeItem, TestBedTreeProvider } from './baseTreeProvider';

function splitRoleLabel(roles: string[]): string {
  if (roles.includes('train') && roles.includes('test')) {
    return 'train+test';
  }
  if (roles.includes('train')) {
    return 'train';
  }
  if (roles.includes('test')) {
    return 'test';
  }
  return roles.join(',');
}

export class GoldTreeProvider extends TestBedTreeProvider {
  constructor(private readonly data: IDataProvider) {
    super();
  }

  getChildren(element?: TestBedTreeItem): TestBedTreeItem[] {
    if (!element) {
      const verify = this.data.verifyGold();
      return [
        new TestBedTreeItem(this.data.getPackLabel(), vscode.TreeItemCollapsibleState.Expanded, {
          description: verify.ok ? 'mock ✓' : 'mock ✗',
          tooltip: verify.message,
          contextValue: 'goldPack',
          iconId: 'database',
        }),
      ];
    }

    if (element.contextValue === 'goldPack') {
      const m = this.data.getManifest();
      return [
        new TestBedTreeItem('Manifest', vscode.TreeItemCollapsibleState.None, {
          description: `v${m.schema_version}`,
          iconId: 'file-code',
        }),
        new TestBedTreeItem('Profiles', vscode.TreeItemCollapsibleState.Collapsed, {
          iconId: 'list-tree',
          contextValue: 'goldProfiles',
        }),
        new TestBedTreeItem('Scans', vscode.TreeItemCollapsibleState.Collapsed, {
          iconId: 'folder',
          contextValue: 'goldScans',
        }),
      ];
    }

    if (element.contextValue === 'goldProfiles') {
      return this.data.listProfiles().map(
        (p) =>
          new TestBedTreeItem(p.id, vscode.TreeItemCollapsibleState.None, {
            description: `${p.scanCount} scans`,
            tooltip: p.description,
            iconId: 'beaker',
          }),
      );
    }

    if (element.contextValue === 'goldScans') {
      return this.data.listScans().map(
        (s) =>
          new TestBedTreeItem(s.scan_id, vscode.TreeItemCollapsibleState.None, {
            description: splitRoleLabel(s.split_roles),
            tooltip: s.tags.join(', '),
            iconId: 'file-binary',
          }),
      );
    }

    return [];
  }
}
