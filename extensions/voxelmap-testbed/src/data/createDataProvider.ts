import * as vscode from 'vscode';
import type { IDataProvider } from './mockDataProvider';
import { createMockDataProvider } from './mockDataProvider';
import { getFixturesRootFromConfig } from './manifest';

export function createDataProvider(
  context: vscode.ExtensionContext,
): IDataProvider | undefined {
  const mode = vscode.workspace
    .getConfiguration('vmtb')
    .get<string>('dataMode', 'mock');

  if (mode !== 'mock') {
    return undefined;
  }

  const root = getFixturesRootFromConfig(context.extensionPath);
  if (!root) {
    return undefined;
  }

  return createMockDataProvider(root);
}
