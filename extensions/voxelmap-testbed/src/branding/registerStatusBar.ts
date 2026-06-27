import * as vscode from 'vscode';
import { formatStatusBarText } from './statusBar';

export interface StatusBarState {
  getDataMode: () => string;
  getPackId: () => string | undefined;
  onDidChange?: vscode.Event<void>;
}

export function registerStatusBar(
  context: vscode.ExtensionContext,
  state: StatusBarState,
): vscode.StatusBarItem {
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    50,
  );
  item.command = 'vmtb.welcome.open';

  const refresh = (): void => {
    item.text = `$(beaker) ${formatStatusBarText(state.getDataMode(), state.getPackId())}`;
    item.tooltip = 'VoxelMap TestBed — click to open Welcome';
    item.show();
  };

  refresh();
  context.subscriptions.push(item);

  if (state.onDidChange) {
    context.subscriptions.push(state.onDidChange(refresh));
  }

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('vmtb.dataMode')) {
        refresh();
      }
    }),
  );

  return item;
}
