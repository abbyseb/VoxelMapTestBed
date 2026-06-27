import type { BaselinesFile } from '../data/types';
import type { LeaderboardRow } from './types';

export function baselinesToRows(data: BaselinesFile): LeaderboardRow[] {
  return data.rows.map((r) => ({
    rank: r.rank,
    name: r.name,
    meanDice: r.mean_dice,
    mean3dErrorMm: r.mean_3d_error_mm,
  }));
}

export function mergeLeaderboardRows(
  baselines: LeaderboardRow[],
  runs: Array<{ runId: string; meanDice?: number }>,
): LeaderboardRow[] {
  const rows = [...baselines];
  for (const run of runs) {
    if (run.meanDice === undefined) {
      continue;
    }
    rows.push({
      rank: rows.length + 1,
      name: run.runId,
      meanDice: run.meanDice,
      isRun: true,
    });
  }
  return rows.sort((a, b) => b.meanDice - a.meanDice).map((r, i) => ({
    ...r,
    rank: i + 1,
  }));
}

export function leaderboardTableHtml(rows: LeaderboardRow[]): string {
  const body = rows
    .map(
      (r) =>
        `<tr><td>${r.rank}</td><td>${r.name}${r.isRun ? ' *' : ''}</td>` +
        `<td>${r.meanDice.toFixed(3)}</td><td>${r.mean3dErrorMm?.toFixed(2) ?? '—'}</td></tr>`,
    )
    .join('');
  return `<table><thead><tr><th>#</th><th>Name</th><th>Mean Dice</th><th>3D err</th></tr></thead><tbody>${body}</tbody></table>`;
}
