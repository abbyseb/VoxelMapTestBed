import type { MetricsJson, MetricsSummary } from './types';

export function parseMetricsJson(raw: string): MetricsJson {
  return JSON.parse(raw) as MetricsJson;
}

export function summarizeMetrics(metrics: MetricsJson): MetricsSummary {
  const mean = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return {
    meanDice: mean(metrics.dice),
    meanPsnr: mean(metrics.psnr),
    mean3dErrorMm: mean(metrics.shifts_mm['3d']),
    angleCount: metrics.angles.length,
  };
}

export function formatMetricsTable(metrics: MetricsJson): string[][] {
  const header = ['Angle', 'Dice', 'PSNR', '3D err (mm)'];
  const rows = metrics.angles.map((angle, i) => [
    String(angle),
    metrics.dice[i]?.toFixed(3) ?? '',
    metrics.psnr[i]?.toFixed(1) ?? '',
    metrics.shifts_mm['3d'][i]?.toFixed(2) ?? '',
  ]);
  return [header, ...rows];
}
