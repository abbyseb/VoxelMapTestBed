import * as vscode from 'vscode';
import {
  initWorkspaceFromTemplate,
  resolveTemplateRoot,
} from '../workspace/workspaceTemplate';

export async function registerInitWorkspaceCommand(
  context: vscode.ExtensionContext,
): Promise<void> {
  context.subscriptions.push(
    vscode.commands.registerCommand('vmtb.initWorkspace', async () => {
      const folder = vscode.workspace.workspaceFolders?.[0];
      if (!folder) {
        void vscode.window.showErrorMessage(
          'Open a folder workspace before initializing TestBed layout.',
        );
        return;
      }

      const templateRoot = resolveTemplateRoot(
        context.extensionPath,
        folder.uri.fsPath,
      );

      if (!templateRoot) {
        void vscode.window.showErrorMessage(
          'workspace-template/ not found. Clone VoxelMapTestBed repo or reinstall extension.',
        );
        return;
      }

      const result = initWorkspaceFromTemplate(
        templateRoot,
        folder.uri.fsPath,
      );

      const msg =
        result.copied.length > 0
          ? `TestBed workspace initialized (${result.copied.length} files).`
          : `TestBed layout already present (${result.skipped.length} skipped).`;

      void vscode.window.showInformationMessage(msg);
    }),
  );
}
