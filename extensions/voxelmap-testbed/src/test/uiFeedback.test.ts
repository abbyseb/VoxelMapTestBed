// Task ID: 2.4 — UI feedback doc from G-UI review
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DOC = join(resolve(__dirname, '../../../../'), 'docs/UI_FEEDBACK.md');

describe('2.4 UI feedback doc', () => {
  it('UI_FEEDBACK.md exists with review sections', () => {
    expect(existsSync(DOC)).toBe(true);
    const md = readFileSync(DOC, 'utf8');
    expect(md).toContain('## Open items');
    expect(md).toContain('## Sign-off');
    expect(md).toContain('G-UI');
  });
});
