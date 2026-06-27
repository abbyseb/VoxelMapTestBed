import type {
  ExperimentEntry,
  GoldManifest,
  LeaderboardEntry,
  RunArtifact,
  RunEntry,
} from './types';
import { loadDemoScans, verifyDemoCases } from './demoScans';
import type { IDataProvider } from './mockDataProvider';
import { MockDataProvider } from './mockDataProvider';

/** Reads scan inventory from DEMO folder; runs/experiments still from fixtures/. */
export class DemoDataProvider implements IDataProvider {
  readonly mode = 'demo' as const;

  private readonly fixtures: MockDataProvider;

  constructor(
    private readonly demoRoot: string,
    fixturesRoot: string,
  ) {
    this.fixtures = new MockDataProvider(fixturesRoot);
  }

  getManifest(): GoldManifest {
    const base = this.fixtures.getManifest();
    const scans = loadDemoScans(this.demoRoot);
    return {
      ...base,
      pack_id: scans.length > 0 ? 'spare-demo-v1' : base.pack_id,
      scans: scans.length > 0 ? scans : base.scans,
    };
  }

  getPackLabel(): string {
    return this.getManifest().pack_id;
  }

  listProfiles(): Array<{ id: string; description: string; scanCount: number }> {
    return this.fixtures.listProfiles();
  }

  listScans(): GoldManifest['scans'] {
    return this.getManifest().scans;
  }

  listExperiments(): ExperimentEntry[] {
    return this.fixtures.listExperiments();
  }

  listRuns(): RunEntry[] {
    return this.fixtures.listRuns();
  }

  listRunArtifacts(runId: string): RunArtifact[] {
    return this.fixtures.listRunArtifacts(runId);
  }

  listLeaderboard(profileId?: string): LeaderboardEntry[] {
    return this.fixtures.listLeaderboard(profileId);
  }

  getFixturesRoot(): string {
    return this.fixtures.getFixturesRoot();
  }

  verifyGold(): { ok: boolean; message: string } {
    const scans = this.listScans();
    if (scans.length === 0) {
      return { ok: false, message: 'demo ✗ no cases found under demo path' };
    }
    const result = verifyDemoCases(this.demoRoot, scans);
    if (!result.ok) {
      return result;
    }
    const m = this.getManifest();
    return {
      ok: true,
      message: `demo ✓ ${m.pack_id} (${scans.length} scans)`,
    };
  }
}

export function createDemoDataProvider(
  demoRoot: string,
  fixturesRoot: string,
): DemoDataProvider {
  return new DemoDataProvider(demoRoot, fixturesRoot);
}
