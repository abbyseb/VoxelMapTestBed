import type { IDataProvider } from '../data/mockDataProvider';
import { GoldChecklist, scanIdsFromProfile } from '../gold/goldChecklist';
import { buildExperimentPreviewYaml } from '../gold/experimentPreview';

export class TestBedSession {
  readonly checklist: GoldChecklist;
  activeProfileId = 'smoke';
  private experimentYaml = '';
  private readonly listeners = new Set<() => void>();

  constructor(readonly data: IDataProvider) {
    const smoke = data.getManifest().profiles.smoke;
    this.checklist = new GoldChecklist(scanIdsFromProfile(smoke));
    this.refreshExperimentYaml();
  }

  onDidChange(listener: () => void): { dispose: () => void } {
    this.listeners.add(listener);
    return { dispose: () => this.listeners.delete(listener) };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  applyProfile(profileId: string): void {
    if (profileId === 'custom') {
      this.activeProfileId = 'custom';
    } else {
      const profile = this.data.getManifest().profiles[profileId];
      if (!profile) {
        throw new Error(`Unknown profile: ${profileId}`);
      }
      this.checklist.applyProfile(profile);
      this.activeProfileId = profileId;
    }
    this.refreshExperimentYaml();
    this.notify();
  }

  onChecklistChanged(): void {
    if (this.activeProfileId === 'custom') {
      this.refreshExperimentYaml();
    }
    this.notify();
  }

  refreshExperimentYaml(): void {
    this.experimentYaml = buildExperimentPreviewYaml({
      packId: this.data.getPackLabel(),
      profileId: this.activeProfileId,
      customScans: this.checklist.getSelected(),
      manifest: this.data.getManifest(),
    });
  }

  getExperimentYaml(): string {
    return this.experimentYaml;
  }

  setExperimentYaml(yaml: string): void {
    this.experimentYaml = yaml;
    this.notify();
  }
}
