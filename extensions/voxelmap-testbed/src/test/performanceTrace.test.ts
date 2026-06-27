// Task ID: 1.3.4 — Performance trace asset
import { describe, expect, it } from 'vitest';
import { join, resolve } from 'node:path';
import { resolvePerformanceTracePath } from '../webviews/performanceTrace';

const RUN_ROOT = join(
  resolve(__dirname, '../../../../fixtures'),
  'runs/exp_demo_baseline',
);

describe('1.3.4 performanceTrace', () => {
  it('resolves Performance_Trace.png from fixture run', () => {
    const p = resolvePerformanceTracePath(RUN_ROOT);
    expect(p).toContain('Performance_Trace.png');
  });

  it('returns undefined when trace missing', () => {
    expect(resolvePerformanceTracePath('/nonexistent/run')).toBeUndefined();
  });
});
