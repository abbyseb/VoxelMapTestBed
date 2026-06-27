import { vi } from 'vitest';

export enum TreeItemCollapsibleState {
  None = 0,
  Collapsed = 1,
  Expanded = 2,
}

export class ThemeIcon {
  constructor(public readonly id: string) {}
}

export class TreeItem {
  label?: string;
  description?: string;
  tooltip?: string;
  contextValue?: string;
  iconPath?: ThemeIcon;
  command?: { command: string; title: string };
  collapsibleState: TreeItemCollapsibleState;

  constructor(label: string, collapsibleState: TreeItemCollapsibleState) {
    this.label = label;
    this.collapsibleState = collapsibleState;
  }
}

export class EventEmitter<T> {
  private listener?: (e: T) => void;
  event = (listener: (e: T) => void) => {
    this.listener = listener;
    return { dispose: () => {} };
  };
  fire(data: T): void {
    this.listener?.(data);
  }
}

vi.mock('vscode', () => {
  const window = {
    createOutputChannel: vi.fn(() => ({
      appendLine: vi.fn(),
      show: vi.fn(),
      dispose: vi.fn(),
    })),
    showInformationMessage: vi.fn(),
    registerTreeDataProvider: vi.fn(),
  };

  const workspace = {
    getConfiguration: vi.fn(() => ({
      get: vi.fn((_key: string, defaultValue: unknown) => defaultValue),
    })),
  };

  const commands = {
    registerCommand: vi.fn(() => ({ dispose: vi.fn() })),
  };

  return {
    TreeItemCollapsibleState,
    ThemeIcon,
    TreeItem,
    EventEmitter,
    window,
    workspace,
    commands,
    Uri: { file: (path: string) => ({ fsPath: path }) },
  };
});
