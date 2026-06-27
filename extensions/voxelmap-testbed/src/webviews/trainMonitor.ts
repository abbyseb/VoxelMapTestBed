import type { LossPoint } from './types';

export function parseLossCsv(content: string): LossPoint[] {
  const lines = content.trim().split('\n');
  const points: LossPoint[] = [];
  for (let i = 1; i < lines.length; i++) {
    const [epoch, train, val] = lines[i].split(',');
    points.push({
      epoch: Number(epoch),
      trainLoss: Number(train),
      valLoss: Number(val),
    });
  }
  return points;
}

/** Simulate live tail — last N epochs (default all for demo CSV). */
export function tailLossPoints(points: LossPoint[], count?: number): LossPoint[] {
  if (!count || count >= points.length) {
    return points;
  }
  return points.slice(-count);
}

export function lossSeriesSvg(points: LossPoint[], width = 400, height = 160): string {
  if (points.length === 0) {
    return '';
  }
  const maxY = Math.max(...points.flatMap((p) => [p.trainLoss, p.valLoss]));
  const minY = Math.min(...points.flatMap((p) => [p.trainLoss, p.valLoss]));
  const span = maxY - minY || 1;
  const xStep = width / Math.max(points.length - 1, 1);

  const toPath = (key: 'trainLoss' | 'valLoss', color: string) => {
    const d = points
      .map((p, i) => {
        const x = i * xStep;
        const y = height - ((p[key] - minY) / span) * (height - 10) - 5;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" />`;
  };

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${toPath('trainLoss', '#81c784')}
    ${toPath('valLoss', '#ffb74d')}
  </svg>`;
}
