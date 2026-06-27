// Task ID: 1.3.6 — TrainMonitor CSV tail
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  lossSeriesSvg,
  parseLossCsv,
  tailLossPoints,
} from '../webviews/trainMonitor';

const CSV = join(resolve(__dirname, '../../../../fixtures'), 'train/loss_demo.csv');

describe('1.3.6 trainMonitor', () => {
  const points = parseLossCsv(readFileSync(CSV, 'utf8'));

  it('parses loss_demo.csv', () => {
    expect(points).toHaveLength(8);
    expect(points[0].epoch).toBe(1);
    expect(points[7].valLoss).toBeLessThan(points[0].valLoss);
  });

  it('tails last N epochs', () => {
    expect(tailLossPoints(points, 3)).toHaveLength(3);
    expect(tailLossPoints(points, 3)[0].epoch).toBe(6);
  });

  it('renders loss svg', () => {
    const svg = lossSeriesSvg(points);
    expect(svg).toContain('<path');
    expect(svg).toContain('#81c784');
  });
});
