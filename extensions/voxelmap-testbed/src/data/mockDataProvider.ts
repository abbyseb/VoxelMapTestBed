import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  loadManifestFromFile,
  validateManifest,
} from './manifest';
import type {
  BaselinesFile,
  ExperimentEntry,
  GoldManifest,
  LeaderboardEntry,
  RunArtifact,
  RunEntry,
} from './types';

export interface IDataProvider {
  readonly mode: 'mock' | 'live';
  getManifest(): GoldManifest;
  getPackLabel(): string;
  listProfiles(): Array<{ id: string; description: string; scanCount: number }>;
  listScans(): GoldManifest['scans'];
  listExperiments(): ExperimentEntry[];
  listRuns(): RunEntry[];
  listRunArtifacts(runId: string): RunArtifact[];
  listLeaderboard(profileId?: string): LeaderboardEntry[];
  verifyGold(): { ok: boolean; message: string };
}

export class MockDataProvider implements IDataProvider {
  readonly mode = 'mock' as const;

  constructor(private readonly fixturesRoot: string) {}

  getManifest(): GoldManifest {
    const m = loadManifestFromFile(path.join(this.fixturesRoot, 'manifest.yaml'));
    validateManifest(m);
    return m;
  }

  getPackLabel(): string {
    return this.getManifest().pack_id;
  }

  listProfiles(): Array<{ id: string; description: string; scanCount: number }> {
    const m = this.getManifest();
    return Object.entries(m.profiles).map(([id, p]) => ({
      id,
      description: String(p.description ?? id),
      scanCount: (p.train?.length ?? 0) + (p.test?.length ?? 0),
    }));
  }

  listScans(): GoldManifest['scans'] {
    return this.getManifest().scans;
  }

  listExperiments(): ExperimentEntry[] {
    const dir = path.join(this.fixturesRoot, 'experiments');
    if (!fs.existsSync(dir)) {
      return [];
    }
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
      .sort()
      .map((fileName) => {
        const content = fs.readFileSync(path.join(dir, fileName), 'utf8');
        const name = content.match(/^name:\s*(.+)$/m)?.[1]?.trim() ?? fileName;
        const profile =
          content.match(/^  profile:\s*(.+)$/m)?.[1]?.trim() ?? 'smoke';
        return { fileName, name, profile };
      });
  }

  listRuns(): RunEntry[] {
    const dir = path.join(this.fixturesRoot, 'runs');
    if (!fs.existsSync(dir)) {
      return [];
    }
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
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

  listRunArtifacts(runId: string): RunArtifact[] {
    const base = path.join(this.fixturesRoot, 'runs', runId);
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

  listLeaderboard(profileId = 'smoke'): LeaderboardEntry[] {
    const baselinesPath = path.join(
      this.fixturesRoot,
      'baselines',
      `${profileId}.json`,
    );
    const entries: LeaderboardEntry[] = [];

    if (fs.existsSync(baselinesPath)) {
      const data = JSON.parse(
        fs.readFileSync(baselinesPath, 'utf8'),
      ) as BaselinesFile;
      for (const row of data.rows.slice(0, 3)) {
        entries.push({
          rank: row.rank,
          name: row.name,
          metricLabel: `${row.mean_dice.toFixed(3)} Dice`,
        });
      }
    }

    for (const run of this.listRuns()) {
      if (run.meanDice !== undefined) {
        entries.push({
          rank: entries.length + 1,
          name: run.runId,
          metricLabel: `${run.meanDice.toFixed(3)} Dice`,
          isRun: true,
        });
      }
    }

    return entries.sort((a, b) => a.rank - b.rank);
  }

  verifyGold(): { ok: boolean; message: string } {
    try {
      const m = this.getManifest();
      const missing = m.scans.filter(
        (s) => !m.checksums[s.scan_id],
      );
      if (missing.length > 0) {
        return { ok: false, message: `Missing checksums for ${missing.length} scan(s)` };
      }
      return { ok: true, message: `mock ✓ ${m.pack_id} (${m.scans.length} scans)` };
    } catch (e) {
      return { ok: false, message: String(e) };
    }
  }
}

export function createMockDataProvider(fixturesRoot: string): MockDataProvider {
  return new MockDataProvider(fixturesRoot);
}
