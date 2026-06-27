// Task ID: 1.3.3 — Polar gantry plot
import { describe, expect, it } from 'vitest';
import { gantryPlotSvg, polarPoints } from '../webviews/gantryPlot';

describe('1.3.3 gantryPlot', () => {
  it('maps angles to polar coordinates', () => {
    const pts = polarPoints([0, 90], [1, 0.5]);
    expect(pts[0].x).toBeCloseTo(1);
    expect(pts[0].y).toBeCloseTo(0);
    expect(pts[1].x).toBeCloseTo(0, 1);
    expect(pts[1].y).toBeCloseTo(0.5);
  });

  it('renders svg polygon', () => {
    const svg = gantryPlotSvg(polarPoints([0, 180], [0.9, 0.8]));
    expect(svg).toContain('<svg');
    expect(svg).toContain('<polygon');
    expect(svg).toContain('<circle');
  });
});
