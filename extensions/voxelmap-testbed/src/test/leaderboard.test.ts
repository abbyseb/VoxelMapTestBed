// Task ID: 1.3.5 — Leaderboard webview data
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  baselinesToRows,
  leaderboardTableHtml,
  mergeLeaderboardRows,
} from '../webviews/leaderboardView';

const BASELINES = join(resolve(__dirname, '../../../../fixtures'), 'baselines/smoke.json');

describe('1.3.5 leaderboard webview', () => {
  it('loads eight baseline rows from smoke.json', () => {
    const data = JSON.parse(readFileSync(BASELINES, 'utf8'));
    const rows = baselinesToRows(data);
    expect(rows).toHaveLength(8);
    expect(rows[0].name).toContain('concat');
  });

  it('merges demo runs and sorts by dice', () => {
    const data = JSON.parse(readFileSync(BASELINES, 'utf8'));
    const rows = mergeLeaderboardRows(baselinesToRows(data), [
      { runId: 'exp_demo_baseline', meanDice: 0.914 },
    ]);
    expect(rows[0].meanDice).toBeGreaterThanOrEqual(0.91);
    expect(rows.some((r) => r.isRun)).toBe(true);
  });

  it('renders html table', () => {
    const html = leaderboardTableHtml([
      { rank: 1, name: 'test', meanDice: 0.9 },
    ]);
    expect(html).toContain('<table>');
    expect(html).toContain('0.900');
  });
});
