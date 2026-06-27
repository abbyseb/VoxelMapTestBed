import * as vscode from 'vscode';
import type { IDataProvider } from '../data/mockDataProvider';
import type { TestBedSession } from '../session/testBedSession';
import { GoldChecklist } from '../gold/goldChecklist';
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
  constructor(
    private readonly data: IDataProvider,
    private readonly session: TestBedSession,
  ) {
    super();
  }

  get checklist(): GoldChecklist {
    return this.session.checklist;
  }

  setScanChecked(scanId: string, checked: boolean): void {
    this.session.checklist.setSelected(scanId, checked);
    this.session.onChecklistChanged();
    this.refresh();
  }

  async pickTagFilter(): Promise<void> {
    const scans = this.data.listScans();
    const allTags = [...new Set(scans.flatMap((s) => s.tags))].sort();
    const active = new Set(this.session.checklist.getActiveTags());

    const picks = await vscode.window.showQuickPick(
      allTags.map((tag) => ({
        label: tag,
        picked: active.has(tag),
      })),
      {
        canPickMany: true,
        placeHolder: 'Filter checklist by tags (AND). Pick none to show all.',
        title: 'Gold scan tag filter',
      },
    );

    if (picks === undefined) {
      return;
    }

    this.session.checklist.setTagFilter(picks.map((p) => p.label));
    this.session.onChecklistChanged();
    this.refresh();
  }

  async pickProfile(): Promise<void> {
    const options = this.data.listProfiles().map((p) => ({
      label: p.id,
      description: p.description,
    }));
    options.push({
      label: 'custom',
      description: 'Use checklist selection as custom_scans',
    });

    const pick = await vscode.window.showQuickPick(options, {
      placeHolder: 'Select Gold profile for experiment preview',
      title: 'Gold profile',
    });
    if (!pick) {
      return;
    }
    this.session.applyProfile(pick.label);
    this.refresh();
  }

  applyProfile(profileId: string): void {
    this.session.applyProfile(profileId);
    this.refresh();
  }

  getChildren(element?: TestBedTreeItem): TestBedTreeItem[] {
    if (!element) {
      const verify = this.data.verifyGold();
      const badge = this.data.mode;
      return [
        new TestBedTreeItem(this.data.getPackLabel(), vscode.TreeItemCollapsibleState.Expanded, {
          description: verify.ok ? `${badge} ✓` : `${badge} ✗`,
          tooltip: verify.message,
          contextValue: 'goldPack',
          iconId: 'database',
        }),
      ];
    }

    if (element.contextValue === 'goldPack') {
      const m = this.data.getManifest();
      const selected = this.session.checklist.selectedCount();
      return [
        new TestBedTreeItem('Manifest', vscode.TreeItemCollapsibleState.None, {
          description: `v${m.schema_version} · ${m.preprocessing.pipeline_version}`,
          tooltip: `pack ${m.pack_id} · created ${m.created}`,
          iconId: 'file-code',
        }),
        new TestBedTreeItem('Profiles', vscode.TreeItemCollapsibleState.Collapsed, {
          description: `active: ${this.session.activeProfileId}`,
          iconId: 'list-tree',
          contextValue: 'goldProfiles',
        }),
        new TestBedTreeItem('Checklist', vscode.TreeItemCollapsibleState.Expanded, {
          description: `${selected} selected`,
          tooltip: 'Select scans for experiments; filter by tags',
          iconId: 'checklist',
          contextValue: 'goldChecklist',
        }),
        new TestBedTreeItem('Scans', vscode.TreeItemCollapsibleState.Collapsed, {
          iconId: 'folder',
          contextValue: 'goldScans',
        }),
      ];
    }

    if (element.contextValue === 'goldProfiles') {
      const active = this.session.activeProfileId;
      return this.data.listProfiles().map(
        (p) =>
          new TestBedTreeItem(p.id, vscode.TreeItemCollapsibleState.None, {
            description: active === p.id ? 'active' : `${p.scanCount} scans`,
            tooltip: p.description,
            iconId: active === p.id ? 'check' : 'beaker',
            command: {
              command: 'vmtb.gold.applyProfile',
              title: 'Apply profile',
              arguments: [p.id],
            },
          }),
      ).concat(
        new TestBedTreeItem('custom', vscode.TreeItemCollapsibleState.None, {
          description: active === 'custom' ? 'active' : 'checklist scans',
          tooltip: 'Use checklist selection as custom_scans',
          iconId: active === 'custom' ? 'check' : 'edit',
          command: {
            command: 'vmtb.gold.applyProfile',
            title: 'Apply custom profile',
            arguments: ['custom'],
          },
        }),
      );
    }

    if (element.contextValue === 'goldChecklist') {
      const tags = this.session.checklist.getActiveTags();
      const filterItem = new TestBedTreeItem('Tag filter', vscode.TreeItemCollapsibleState.None, {
        description: tags.length > 0 ? tags.join(', ') : 'all',
        tooltip: 'Click to filter scans by tags',
        contextValue: 'goldChecklistFilter',
        iconId: 'filter',
        command: {
          command: 'vmtb.gold.filterTags',
          title: 'Filter tags',
        },
      });

      const scans = this.session.checklist.filterScans(this.data.listScans());
      const scanItems = scans.map((s) => {
        const item = new TestBedTreeItem(s.scan_id, vscode.TreeItemCollapsibleState.None, {
          description: splitRoleLabel(s.split_roles),
          tooltip: s.tags.join(', '),
          contextValue: 'goldChecklistScan',
          iconId: 'file-binary',
        });
        item.scanId = s.scan_id;
        item.checkboxState = this.session.checklist.isSelected(s.scan_id)
          ? vscode.TreeItemCheckboxState.Checked
          : vscode.TreeItemCheckboxState.Unchecked;
        return item;
      });

      return [filterItem, ...scanItems];
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
