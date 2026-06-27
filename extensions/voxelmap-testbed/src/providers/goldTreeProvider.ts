import * as vscode from 'vscode';
import { TestBedTreeItem, TestBedTreeProvider } from './baseTreeProvider';

/** Gold pack browser — placeholder until fixtures/manifest (1.1.4). */
export class GoldTreeProvider extends TestBedTreeProvider {
  getChildren(element?: TestBedTreeItem): TestBedTreeItem[] {
    if (!element) {
      return [
        new TestBedTreeItem('spare-gold-smoke-v1', vscode.TreeItemCollapsibleState.Expanded, {
          description: 'mock',
          tooltip: 'Smoke Gold pack (fixtures coming in 1.1.4)',
          contextValue: 'goldPack',
          iconId: 'database',
        }),
      ];
    }

    if (element.contextValue === 'goldPack') {
      return [
        new TestBedTreeItem('Manifest', vscode.TreeItemCollapsibleState.None, {
          description: 'v1 stub',
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
      return [
        new TestBedTreeItem('smoke', vscode.TreeItemCollapsibleState.None, {
          description: '2 scans',
          iconId: 'beaker',
        }),
      ];
    }

    if (element.contextValue === 'goldScans') {
      return [
        new TestBedTreeItem('MC_V_P1_NS_01', vscode.TreeItemCollapsibleState.None, {
          description: 'train',
          iconId: 'file-binary',
        }),
        new TestBedTreeItem('MC_V_P2_SC_02', vscode.TreeItemCollapsibleState.None, {
          description: 'test',
          iconId: 'file-binary',
        }),
      ];
    }

    return [];
  }
}
