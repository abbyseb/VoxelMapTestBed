/** Polar gantry plot points from angle (deg) and metric value. */
export interface PolarPoint {
  angleDeg: number;
  value: number;
  x: number;
  y: number;
}

export function polarPoints(
  anglesDeg: number[],
  values: number[],
  radius = 1,
): PolarPoint[] {
  return anglesDeg.map((angleDeg, i) => {
    const rad = (angleDeg * Math.PI) / 180;
    const v = values[i] ?? 0;
    return {
      angleDeg,
      value: v,
      x: Math.cos(rad) * v * radius,
      y: Math.sin(rad) * v * radius,
    };
  });
}

export function gantryPlotSvg(points: PolarPoint[], size = 220): string {
  const cx = size / 2;
  const cy = size / 2;
  const scale = (size / 2) * 0.85;
  const poly = points
    .map((p) => {
      const x = cx + p.x * scale;
      const y = cy - p.y * scale;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const circles = points
    .map((p) => {
      const x = cx + p.x * scale;
      const y = cy - p.y * scale;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#4fc3f7" />`;
    })
    .join('');

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${cx}" cy="${cy}" r="${scale}" fill="none" stroke="#555" />
    <polygon points="${poly}" fill="rgba(79,195,247,0.2)" stroke="#4fc3f7" stroke-width="2" />
    ${circles}
  </svg>`;
}
