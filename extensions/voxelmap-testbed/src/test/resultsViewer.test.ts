// Task ID: 1.3.2 — ResultsViewer metrics parse
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  formatMetricsTable,
  parseMetricsJson,
  summarizeMetrics,
} from '../webviews/resultsViewer';

const METRICS = join(
  resolve(__dirname, '../../../../fixtures'),
  'runs/exp_demo_baseline/test/metrics.json',
);

describe('1.3.2 resultsViewer', () => {
  const raw = readFileSync(METRICS, 'utf8');
  const metrics = parseMetricsJson(raw);

  it('parses LEARN-GUI metrics.json shape', () => {
    expect(metrics.angles).toHaveLength(8);
    expect(metrics.dice).toHaveLength(8);
    expect(metrics.shifts_mm['3d']).toHaveLength(8);
  });

  it('summarizes mean dice and psnr', () => {
    const s = summarizeMetrics(metrics);
    expect(s.meanDice).toBeGreaterThan(0.9);
    expect(s.meanPsnr).toBeGreaterThan(28);
    expect(s.angleCount).toBe(8);
  });

  it('formats per-angle table rows', () => {
    const table = formatMetricsTable(metrics);
    expect(table[0]).toEqual(['Angle', 'Dice', 'PSNR', '3D err (mm)']);
    expect(table.length).toBe(9);
  });
});
