// Task ID: 1.1.5 — fixtures/runs/exp_demo_*
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const FIXTURES = resolve(__dirname, '../../../../fixtures');
const RUNS = join(FIXTURES, 'runs');

const DEMO_RUNS = ['exp_demo_baseline', 'exp_demo_custom'] as const;

describe('1.1.5 fixtures demo runs', () => {
  for (const runId of DEMO_RUNS) {
    it(`${runId} has experiment.yaml, notes.md, metrics.json`, () => {
      const base = join(RUNS, runId);
      expect(existsSync(join(base, 'experiment.yaml'))).toBe(true);
      expect(existsSync(join(base, 'notes.md'))).toBe(true);
      expect(existsSync(join(base, 'test', 'metrics.json'))).toBe(true);
    });

    it(`${runId} metrics.json matches LEARN-GUI schema`, () => {
      const metrics = JSON.parse(
        readFileSync(join(RUNS, runId, 'test', 'metrics.json'), 'utf8'),
      ) as {
        angles: number[];
        dice: number[];
        shifts_mm: { lr: number[]; '3d': number[] };
        gt_shifts_mm: { lr: number[] };
      };
      expect(metrics.angles.length).toBeGreaterThan(0);
      expect(metrics.dice.length).toBe(metrics.angles.length);
      expect(metrics.shifts_mm['3d'].length).toBe(metrics.angles.length);
      expect(metrics.gt_shifts_mm.lr.length).toBe(metrics.angles.length);
    });

    it(`${runId} has compare/vs_baselines.json`, () => {
      expect(
        existsSync(join(RUNS, runId, 'compare', 'vs_baselines.json')),
      ).toBe(true);
    });
  }

  it('exp_demo_baseline has Performance_Trace.png', () => {
    expect(
      existsSync(
        join(RUNS, 'exp_demo_baseline', 'test', 'Performance_Trace.png'),
      ),
    ).toBe(true);
  });
});
