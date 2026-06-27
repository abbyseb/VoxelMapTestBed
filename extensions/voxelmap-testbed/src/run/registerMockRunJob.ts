import * as vscode from 'vscode';
import type { IDataProvider } from '../data/mockDataProvider';
import type { TestBedSession } from '../session/testBedSession';
import { resolveMockRunsRoot } from '../workspace/resolveMockRunsRoot';
import { simulateRunJob } from './mockRunJob';
import type { RunDataService } from './runDataService';

export async function runSimulatedExperiment(
  context: vscode.ExtensionContext,
  data: IDataProvider,
  session: TestBedSession,
  runService: RunDataService,
): Promise<string | undefined> {
  const cfg = vscode.workspace.getConfiguration('vmtb');
  const resolved = resolveMockRunsRoot({
    workspaceFolder: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
    extensionPath: context.extensionPath,
    settingOverride: cfg.get<string>('mockRunsWorkspace', ''),
  });

  if (!resolved) {
    void vscode.window.showErrorMessage(
      'Open the VoxelMapTestBed folder in the Extension Development Host (File → Open Folder), or set vmtb.mockRunsWorkspace.',
    );
    return undefined;
  }

  if (resolved.source === 'repo') {
    void vscode.window.showInformationMessage(
      'Mock runs will be saved to VoxelMapTestBed/runs/ (no workspace folder open).',
    );
  }

  const workspaceRoot = resolved.root;
  let newRunId: string | undefined;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'VoxelMap TestBed — simulated run',
      cancellable: false,
    },
    async (progress) => {
      let last = 0;
      newRunId = await simulateRunJob({
        fixturesRoot: data.getFixturesRoot(),
        workspaceRoot,
        experimentYaml: session.getExperimentYaml(),
        onProgress: (fraction, message) => {
          progress.report({
            increment: (fraction - last) * 100,
            message,
          });
          last = fraction;
        },
      });
    },
  );

  runService.setWorkspaceRoot(workspaceRoot);
  return newRunId;
}

export function getInitialMockRunsRoot(
  context: vscode.ExtensionContext,
): string | undefined {
  const cfg = vscode.workspace.getConfiguration('vmtb');
  return resolveMockRunsRoot({
    workspaceFolder: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
    extensionPath: context.extensionPath,
    settingOverride: cfg.get<string>('mockRunsWorkspace', ''),
  })?.root;
}
