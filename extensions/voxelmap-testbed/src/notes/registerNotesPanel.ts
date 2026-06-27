import * as fs from 'node:fs';
import * as vscode from 'vscode';
import { notesPanelHtml } from './notesPanel';

let panel: vscode.WebviewPanel | undefined;

export async function openRunNotesEditor(notesPath: string): Promise<void> {
  const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(notesPath));
  await vscode.window.showTextDocument(doc, { preview: false });
}

export function openRunNotesPanel(
  context: vscode.ExtensionContext,
  runId: string,
  notesPath: string,
): void {
  const markdown = fs.readFileSync(notesPath, 'utf8');

  if (panel) {
    panel.title = `Notes: ${runId}`;
    panel.webview.html = notesPanelHtml(runId, markdown);
    panel.reveal();
    return;
  }

  panel = vscode.window.createWebviewPanel(
    'vmtb.notesPanel',
    `Notes: ${runId}`,
    vscode.ViewColumn.Beside,
    { enableScripts: false },
  );

  panel.webview.html = notesPanelHtml(runId, markdown);
  panel.onDidDispose(() => {
    panel = undefined;
  });
  context.subscriptions.push(panel);
}
