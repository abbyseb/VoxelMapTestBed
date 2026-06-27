import * as vscode from 'vscode';
import type { IDataProvider } from '../data/mockDataProvider';
import type { TestBedSession } from '../session/testBedSession';
import { simulateRunJob } from './mockRunJob';
import type { RunDataService } from './runDataService';

export async function runSimulatedExperiment(
  data: IDataProvider,
  session: TestBedSession,
  runService: RunDataService,
): Promise<string | undefined> {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) {
    void vscode.window.showErrorMessage(
      'Open a workspace folder to write mock runs (runs/ will be created).',
    );
    return undefined;
  }

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
