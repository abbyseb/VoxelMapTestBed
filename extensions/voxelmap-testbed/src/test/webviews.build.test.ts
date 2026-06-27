// Task ID: 1.3.1 — Webview build pipeline
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const EXT = resolve(__dirname, '../..');

describe('1.3.1 webview build pipeline', () => {
  it('esbuild.webviews.js produces bundled client scripts', () => {
    execSync('node esbuild.webviews.js', { cwd: EXT, stdio: 'pipe' });
    for (const name of ['results.js', 'leaderboard.js', 'train.js']) {
      expect(existsSync(join(EXT, 'dist/webviews', name))).toBe(true);
    }
  });

  it('compile script includes webviews bundle', () => {
    const pkg = JSON.parse(readFileSync(join(EXT, 'package.json'), 'utf8')) as {
      scripts: { compile: string };
    };
    expect(pkg.scripts.compile).toContain('esbuild.webviews.js');
  });
});
