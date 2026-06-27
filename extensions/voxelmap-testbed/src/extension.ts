import * as vscode from 'vscode';
import { registerSidebarViews } from './views/registerViews';
import { openWelcomeWebview, showWelcomeOnFirstRun } from './webviews/registerWelcomeWebview';
import { registerInitWorkspaceCommand } from './workspace/registerInitWorkspace';

const OUTPUT_CHANNEL_NAME = 'VoxelMap TestBed';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext): void {
  outputChannel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);

  const config = vscode.workspace.getConfiguration('vmtb');
  const dataMode = config.get<string>('dataMode', 'mock');

  outputChannel.appendLine('VoxelMap TestBed extension activated.');
  outputChannel.appendLine(`dataMode: ${dataMode}`);

  const views = registerSidebarViews(context);
  void registerInitWorkspaceCommand(context);

  context.subscriptions.push(
    outputChannel,
    vscode.commands.registerCommand('vmtb.showOutput', () => {
      outputChannel.show(true);
    }),
    vscode.commands.registerCommand('vmtb.welcome.open', () => {
      const packId = views?.data.getPackLabel();
      openWelcomeWebview(context, dataMode, packId);
    }),
  );

  void showWelcomeOnFirstRun(context, views?.data.getPackLabel());
}

export function deactivate(): void {
  outputChannel?.dispose();
}
