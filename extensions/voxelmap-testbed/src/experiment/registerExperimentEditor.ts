import * as path from 'node:path';
import * as vscode from 'vscode';
import type { IDataProvider } from '../data/mockDataProvider';
import type { TestBedSession } from '../session/testBedSession';
import {
  experimentEditorHtml,
  parseExperimentYaml,
  validateExperimentSpec,
} from './experimentEditor';

let panel: vscode.WebviewPanel | undefined;

export async function openExperimentFixture(
  data: IDataProvider,
  fileName: string,
): Promise<void> {
  const filePath = path.join(data.getFixturesRoot(), 'experiments', fileName);
  const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
  await vscode.window.showTextDocument(doc, { preview: false });
}

export function openExperimentEditorWebview(
  context: vscode.ExtensionContext,
  session: TestBedSession,
): void {
  if (panel) {
    panel.reveal();
    updatePanel(session);
    return;
  }

  panel = vscode.window.createWebviewPanel(
    'vmtb.experimentEditor',
    'Experiment Editor',
    vscode.ViewColumn.Beside,
    { enableScripts: true, retainContextWhenHidden: true },
  );

  panel.onDidDispose(() => {
    panel = undefined;
  });

  panel.webview.onDidReceiveMessage((msg: { type: string; yaml?: string }) => {
    if (msg.type === 'apply' && typeof msg.yaml === 'string') {
      const spec = parseExperimentYaml(msg.yaml);
      const errors = validateExperimentSpec(spec);
      if (errors.length > 0) {
        void vscode.window.showErrorMessage(`Experiment invalid: ${errors.join('; ')}`);
        panel!.webview.html = experimentEditorHtml(msg.yaml, errors);
        return;
      }
      session.setExperimentYaml(msg.yaml);
      void vscode.window.showInformationMessage('Experiment preview updated');
    }
    if (msg.type === 'reload') {
      updatePanel(session);
    }
  });

  context.subscriptions.push(panel);
  updatePanel(session);
}

function updatePanel(session: TestBedSession): void {
  if (!panel) {
    return;
  }
  const yaml = session.getExperimentYaml();
  const errors = validateExperimentSpec(parseExperimentYaml(yaml));
  panel.webview.html = experimentEditorHtml(yaml, errors);
}

export function disposeExperimentEditor(): void {
  panel?.dispose();
  panel = undefined;
}
