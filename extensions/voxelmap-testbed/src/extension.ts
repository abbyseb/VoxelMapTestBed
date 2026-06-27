import * as vscode from 'vscode';
import { registerSidebarViews } from './views/registerViews';

const OUTPUT_CHANNEL_NAME = 'VoxelMap TestBed';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext): void {
  outputChannel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);

  const config = vscode.workspace.getConfiguration('vmtb');
  const dataMode = config.get<string>('dataMode', 'mock');

  outputChannel.appendLine('VoxelMap TestBed extension activated.');
  outputChannel.appendLine(`dataMode: ${dataMode}`);

  registerSidebarViews(context);

  context.subscriptions.push(
    outputChannel,
    vscode.commands.registerCommand('vmtb.showOutput', () => {
      outputChannel.show(true);
    }),
  );

  void vscode.window.showInformationMessage(
    `VoxelMap TestBed ready (${dataMode} mode) — open the TestBed activity bar icon`,
  );
}

export function deactivate(): void {
  outputChannel?.dispose();
}
