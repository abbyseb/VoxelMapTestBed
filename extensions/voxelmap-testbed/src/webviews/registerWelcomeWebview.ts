import * as vscode from 'vscode';
import { buildWelcomeData } from './welcomeWebview';
import { buildWebviewDocument } from './webviewHtml';

let panel: vscode.WebviewPanel | undefined;

export function openWelcomeWebview(
  context: vscode.ExtensionContext,
  dataMode?: string,
  packId?: string,
): void {
  const mode =
    dataMode ??
    vscode.workspace.getConfiguration('vmtb').get<string>('dataMode', 'mock');
  const data = buildWelcomeData(mode, packId);

  if (panel) {
    panel.reveal();
    panel.webview.html = buildWebviewDocument(panel.webview, context.extensionUri, {
      title: 'VoxelMap TestBed',
      script: 'welcome.js',
      data,
    });
    return;
  }

  panel = vscode.window.createWebviewPanel(
    'vmtb.welcome',
    'VoxelMap TestBed',
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true },
  );

  panel.webview.html = buildWebviewDocument(panel.webview, context.extensionUri, {
    title: 'VoxelMap TestBed',
    script: 'welcome.js',
    data,
  });

  panel.webview.onDidReceiveMessage((msg: { command?: string }) => {
    if (msg.command) {
      void vscode.commands.executeCommand(msg.command);
    }
  });

  panel.onDidDispose(() => {
    panel = undefined;
  });
  context.subscriptions.push(panel);
}

export async function showWelcomeOnFirstRun(
  context: vscode.ExtensionContext,
  packId?: string,
): Promise<void> {
  const seen = context.globalState.get<boolean>('vmtb.welcomeSeen', false);
  if (seen) {
    return;
  }
  openWelcomeWebview(context, undefined, packId);
  await context.globalState.update('vmtb.welcomeSeen', true);
}
