// Task ID: 1.1.1 — Extension scaffold
import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(__dirname, '../..');

describe('1.1.1 extension scaffold', () => {
  it('has package.json with main entry', () => {
    const pkg = JSON.parse(
      readFileSync(resolve(ROOT, 'package.json'), 'utf8'),
    ) as { main?: string; name?: string };
    expect(pkg.name).toBe('voxelmap-testbed');
    expect(pkg.main).toBe('./dist/extension.js');
  });

  it('has tsconfig and esbuild config', () => {
    expect(existsSync(resolve(ROOT, 'tsconfig.json'))).toBe(true);
    expect(existsSync(resolve(ROOT, 'esbuild.js'))).toBe(true);
  });

  it('has extension entry source', () => {
    expect(existsSync(resolve(ROOT, 'src/extension.ts'))).toBe(true);
  });
});
