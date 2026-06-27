import * as vscode from 'vscode';
import { createDemoDataProvider } from './demoDataProvider';
import type { IDataProvider } from './mockDataProvider';
import { createMockDataProvider } from './mockDataProvider';
import { getFixturesRootFromConfig } from './manifest';

export function createDataProvider(
  context: vscode.ExtensionContext,
): IDataProvider | undefined {
  const cfg = vscode.workspace.getConfiguration('vmtb');
  const mode = cfg.get<string>('dataMode', 'mock');

  const fixturesRoot = getFixturesRootFromConfig(context.extensionPath);
  if (!fixturesRoot) {
    return undefined;
  }

  if (mode === 'mock') {
    return createMockDataProvider(fixturesRoot);
  }

  if (mode === 'demo') {
    const demoPath = cfg.get<string>('demoPath', '').trim();
    if (!demoPath) {
      return undefined;
    }
    return createDemoDataProvider(demoPath, fixturesRoot);
  }

  return undefined;
}
