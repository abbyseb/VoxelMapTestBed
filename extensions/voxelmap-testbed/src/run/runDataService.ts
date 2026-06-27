import * as fs from 'node:fs';
import * as path from 'node:path';
import type { IDataProvider } from '../data/mockDataProvider';
import type { RunArtifact, RunEntry } from '../data/types';
import {
  listWorkspaceRuns,
  mergeRunEntries,
  resolveRunRoot,
} from './mockRunJob';

export class RunDataService {
  constructor(
    private readonly data: IDataProvider,
    private workspaceRoot?: string,
  ) {}

  setWorkspaceRoot(root: string | undefined): void {
    this.workspaceRoot = root;
  }

  listRuns(): RunEntry[] {
    const fixtureRuns = this.data.listRuns();
    if (!this.workspaceRoot) {
      return fixtureRuns;
    }
    return mergeRunEntries(fixtureRuns, listWorkspaceRuns(this.workspaceRoot));
  }

  listRunArtifacts(runId: string): RunArtifact[] {
    const base = resolveRunRoot(
      this.data.getFixturesRoot(),
      this.workspaceRoot,
      runId,
    );
    if (!base) {
      return this.data.listRunArtifacts(runId);
    }

    const artifacts: RunArtifact[] = [
      { name: 'experiment.yaml', relativePath: 'experiment.yaml', kind: 'file' },
      { name: 'notes.md', relativePath: 'notes.md', kind: 'file' },
      { name: 'metrics.json', relativePath: 'test/metrics.json', kind: 'file' },
      { name: 'test/', relativePath: 'test', kind: 'folder' },
    ];
    if (fs.existsSync(path.join(base, 'compare', 'vs_baselines.json'))) {
      artifacts.push({
        name: 'compare/vs_baselines.json',
        relativePath: 'compare/vs_baselines.json',
        kind: 'file',
      });
    }
    return artifacts.filter((a) => fs.existsSync(path.join(base, a.relativePath)));
  }

  resolveArtifactPath(runId: string, artifactName: string): string | undefined {
    const base = resolveRunRoot(
      this.data.getFixturesRoot(),
      this.workspaceRoot,
      runId,
    );
    if (!base) {
      return undefined;
    }
    const rel =
      artifactName === 'metrics.json' ? 'test/metrics.json' : artifactName;
    const full = path.join(base, rel);
    return fs.existsSync(full) ? full : undefined;
  }
}
