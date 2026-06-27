import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import type { IDataProvider } from '../data/mockDataProvider';
import type { RunDataService } from '../run/runDataService';
import { gantryPlotSvg, polarPoints } from './gantryPlot';
import { baselinesToRows, leaderboardTableHtml, mergeLeaderboardRows } from './leaderboardView';
import { resolvePerformanceTracePath } from './performanceTrace';
import {
  formatMetricsTable,
  parseMetricsJson,
  summarizeMetrics,
} from './resultsViewer';
import { lossSeriesSvg, parseLossCsv, tailLossPoints } from './trainMonitor';
import { buildWebviewDocument } from './webviewHtml';

const panels: Record<string, vscode.WebviewPanel | undefined> = {};

function showPanel(
  context: vscode.ExtensionContext,
  key: string,
  title: string,
  script: 'results.js' | 'leaderboard.js' | 'train.js',
  data: unknown,
): vscode.WebviewPanel {
  const existing = panels[key];
  if (existing) {
    existing.title = title;
    existing.webview.html = buildWebviewDocument(
      existing.webview,
      context.extensionUri,
      { title, script, data },
    );
    existing.reveal();
    return existing;
  }

  const panel = vscode.window.createWebviewPanel(
    `vmtb.${key}`,
    title,
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true },
  );
  panel.webview.html = buildWebviewDocument(panel.webview, context.extensionUri, {
    title,
    script,
    data,
  });
  panel.onDidDispose(() => {
    panels[key] = undefined;
  });
  panels[key] = panel;
  context.subscriptions.push(panel);
  return panel;
}

export function openResultsViewer(
  context: vscode.ExtensionContext,
  runService: RunDataService,
  runId = 'exp_demo_baseline',
): void {
  const runRoot = runService.resolveRunRoot(runId);
  if (!runRoot) {
    void vscode.window.showErrorMessage(`Run not found: ${runId}`);
    return;
  }

  const metricsPath = path.join(runRoot, 'test', 'metrics.json');
  const metrics = parseMetricsJson(fs.readFileSync(metricsPath, 'utf8'));
  const summary = summarizeMetrics(metrics);
  const gantrySvg = gantryPlotSvg(polarPoints(metrics.angles, metrics.dice, 0.95));

  const panel = vscode.window.createWebviewPanel(
    'vmtb.results',
    `Results — ${runId}`,
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true },
  );

  const tracePath = resolvePerformanceTracePath(runRoot);
  const traceUri = tracePath
    ? panel.webview.asWebviewUri(vscode.Uri.file(tracePath)).toString()
    : undefined;

  panel.webview.html = buildWebviewDocument(panel.webview, context.extensionUri, {
    title: `Results — ${runId}`,
    script: 'results.js',
    data: {
      runId,
      summary,
      table: formatMetricsTable(metrics),
      gantrySvg,
      traceUri,
    },
  });

  panels.results = panel;
  panel.onDidDispose(() => {
    panels.results = undefined;
  });
  context.subscriptions.push(panel);
}

export function openLeaderboardWebview(
  context: vscode.ExtensionContext,
  data: IDataProvider,
  runService: RunDataService,
  profileId = 'smoke',
): void {
  const baselinesPath = path.join(
    data.getFixturesRoot(),
    'baselines',
    `${profileId}.json`,
  );
  const baselinesFile = JSON.parse(fs.readFileSync(baselinesPath, 'utf8'));
  const rows = mergeLeaderboardRows(
    baselinesToRows(baselinesFile),
    runService.listRuns().filter((r) => r.meanDice !== undefined),
  );

  showPanel(context, 'leaderboard', `Leaderboard — ${profileId}`, 'leaderboard.js', {
    profile: profileId,
    tableHtml: leaderboardTableHtml(rows),
  });
}

export function openTrainMonitor(
  context: vscode.ExtensionContext,
  data: IDataProvider,
): void {
  const csvPath = path.join(data.getFixturesRoot(), 'train', 'loss_demo.csv');
  const points = tailLossPoints(parseLossCsv(fs.readFileSync(csvPath, 'utf8')));

  showPanel(context, 'train', 'Train monitor', 'train.js', {
    epochs: points.length,
    svg: lossSeriesSvg(points),
  });
}
