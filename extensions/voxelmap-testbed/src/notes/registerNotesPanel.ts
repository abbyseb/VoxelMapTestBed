import * as vscode from 'vscode';
import type { IDataProvider } from '../data/mockDataProvider';
import { notesPanelHtml, readRunNotes, resolveRunNotesPath } from './notesPanel';

let panel: vscode.WebviewPanel | undefined;

export async function openRunNotesEditor(
  data: IDataProvider,
  runId: string,
): Promise<void> {
  const notesPath = resolveRunNotesPath(data.getFixturesRoot(), runId);
  const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(notesPath));
  await vscode.window.showTextDocument(doc, { preview: false });
}

export function openRunNotesPanel(
  context: vscode.ExtensionContext,
  data: IDataProvider,
  runId: string,
): void {
  const markdown = readRunNotes(data.getFixturesRoot(), runId);

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
