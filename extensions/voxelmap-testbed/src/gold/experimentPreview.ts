import type { GoldManifest } from '../data/types';

export interface ExperimentPreviewInput {
  packId: string;
  profileId: string;
  customScans: string[];
  manifest: GoldManifest;
}

/** Build experiment YAML preview from active profile + checklist (Phase 1.2.3). */
export function buildExperimentPreviewYaml(input: ExperimentPreviewInput): string {
  const profile = input.manifest.profiles[input.profileId];
  const train =
    input.profileId === 'custom'
      ? input.customScans
      : (profile?.train ?? []);
  const test =
    input.profileId === 'custom' ? [] : (profile?.test ?? []);
  const customScans =
    input.profileId === 'custom' ? input.customScans : [];

  const lines = [
    'experiment_id: exp_preview',
    'name: preview',
    'model:',
    '  entry: models.baselines.concatenated:build',
    '  kwargs:',
    '    use_film: true',
    'data:',
    `  gold_pack: ${input.packId}`,
    `  profile: ${input.profileId}`,
    `  custom_scans: [${customScans.join(', ')}]`,
    '  train_scans:',
    ...train.map((id) => `    - ${id}`),
    '  test_scans:',
    ...test.map((id) => `    - ${id}`),
    'train:',
    '  epochs: 20',
    '  batch_size: 8',
    '  lr: 1.0e-5',
    'notes: |',
    '  Generated preview from TestBed profile picker.',
  ];
  return lines.join('\n');
}

export const PROFILE_CUSTOM_ID = 'custom';

export function listProfilePickerOptions(
  manifest: GoldManifest,
): Array<{ id: string; description: string }> {
  const builtIn = Object.entries(manifest.profiles).map(([id, p]) => ({
    id,
    description: String(p.description ?? id),
  }));
  return [
    ...builtIn,
    { id: PROFILE_CUSTOM_ID, description: 'Use checklist selection as custom_scans' },
  ];
}
