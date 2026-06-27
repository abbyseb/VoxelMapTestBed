// Task ID: 1.2.4 — Experiment yaml editor
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  applySpecToYaml,
  parseExperimentYaml,
  validateExperimentSpec,
} from '../experiment/experimentEditor';

const FIXTURES = resolve(__dirname, '../../../../fixtures');
const SMOKE_YAML = readFileSync(join(FIXTURES, 'experiments/smoke.yaml'), 'utf8');

describe('1.2.4 experimentEditor', () => {
  it('parses smoke.yaml fixture fields', () => {
    const spec = parseExperimentYaml(SMOKE_YAML);
    expect(spec.experiment_id).toBe('exp_smoke_baseline');
    expect(spec.name).toBe('smoke_baseline');
    expect(spec.profile).toBe('smoke');
    expect(spec.use_film).toBe(true);
    expect(spec.epochs).toBe(20);
  });

  it('validates required experiment fields', () => {
    const spec = parseExperimentYaml(SMOKE_YAML);
    expect(validateExperimentSpec(spec)).toEqual([]);
    expect(
      validateExperimentSpec({ ...spec, experiment_id: '', epochs: 0 }),
    ).toContain('experiment_id is required');
  });

  it('applies spec edits back into yaml text', () => {
    const updated = applySpecToYaml(SMOKE_YAML, {
      name: 'smoke_edited',
      epochs: 5,
      profile: 'train_mix',
    });
    expect(updated).toContain('name: smoke_edited');
    expect(updated).toContain('epochs: 5');
    expect(updated).toContain('profile: train_mix');
  });

  it('rejects invalid epochs in validation', () => {
    const spec = parseExperimentYaml(SMOKE_YAML);
    expect(validateExperimentSpec({ ...spec, epochs: 0 })).toContain(
      'epochs must be >= 1',
    );
  });
});
