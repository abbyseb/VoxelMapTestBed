import * as fs from 'node:fs';
import * as path from 'node:path';
import type { RunEntry } from '../data/types';
import { isAppleDoubleEntry } from '../data/fsUtil';

export interface SimulateRunOptions {
  fixturesRoot: string;
  workspaceRoot: string;
  templateRunId?: string;
  experimentYaml: string;
  onProgress?: (fraction: number, message: string) => void;
}

export function workspaceRunsDir(workspaceRoot: string): string {
  return path.join(workspaceRoot, 'runs');
}

export function generateMockRunId(): string {
  return `exp_mock_${Date.now()}`;
}

function copyDirSync(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (isAppleDoubleEntry(entry.name)) {
      continue;
    }
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

/** Copy a fixture run into workspace runs/ and write experiment.yaml (Phase 1.2.6). */
export async function simulateRunJob(
  options: SimulateRunOptions,
): Promise<string> {
  const templateRunId = options.templateRunId ?? 'exp_demo_baseline';
  const runId = generateMockRunId();
  const src = path.join(options.fixturesRoot, 'runs', templateRunId);
  const destRoot = workspaceRunsDir(options.workspaceRoot);
  const dest = path.join(destRoot, runId);

  if (!fs.existsSync(src)) {
    throw new Error(`Template run not found: ${templateRunId}`);
  }

  options.onProgress?.(0.1, 'Preparing mock run');
  fs.mkdirSync(destRoot, { recursive: true });

  options.onProgress?.(0.35, `Copying ${templateRunId} artifacts`);
  copyDirSync(src, dest);

  options.onProgress?.(0.65, 'Writing experiment.yaml');
  fs.writeFileSync(path.join(dest, 'experiment.yaml'), options.experimentYaml, 'utf8');

  const notesPath = path.join(dest, 'notes.md');
  const noteSuffix = `\n\n_Simulated run ${runId} at ${new Date().toISOString()}_\n`;
  if (fs.existsSync(notesPath)) {
    fs.appendFileSync(notesPath, noteSuffix, 'utf8');
  } else {
    fs.writeFileSync(notesPath, `# ${runId}${noteSuffix}`, 'utf8');
  }

  options.onProgress?.(1, `Run ${runId} ready`);
  return runId;
}

export function listWorkspaceRuns(workspaceRoot: string): RunEntry[] {
  const dir = workspaceRunsDir(workspaceRoot);
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !isAppleDoubleEntry(d.name))
    .map((d) => {
      const runId = d.name;
      const metricsPath = path.join(dir, runId, 'test', 'metrics.json');
      let meanDice: number | undefined;
      if (fs.existsSync(metricsPath)) {
        const metrics = JSON.parse(
          fs.readFileSync(metricsPath, 'utf8'),
        ) as { dice?: number[] };
        if (metrics.dice?.length) {
          meanDice =
            metrics.dice.reduce((a, b) => a + b, 0) / metrics.dice.length;
        }
      }
      return { runId, status: 'done', meanDice };
    });
}

export function mergeRunEntries(
  fixtureRuns: RunEntry[],
  workspaceRuns: RunEntry[],
): RunEntry[] {
  const byId = new Map<string, RunEntry>();
  for (const run of fixtureRuns) {
    byId.set(run.runId, run);
  }
  for (const run of workspaceRuns) {
    byId.set(run.runId, run);
  }
  return [...byId.values()].sort((a, b) => a.runId.localeCompare(b.runId));
}

export function resolveRunRoot(
  fixturesRoot: string,
  workspaceRoot: string | undefined,
  runId: string,
): string | undefined {
  if (workspaceRoot) {
    const wsPath = path.join(workspaceRunsDir(workspaceRoot), runId);
    if (fs.existsSync(wsPath)) {
      return wsPath;
    }
  }
  const fxPath = path.join(fixturesRoot, 'runs', runId);
  if (fs.existsSync(fxPath)) {
    return fxPath;
  }
  return undefined;
}
