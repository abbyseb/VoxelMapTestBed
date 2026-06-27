// Task ID: 2.3 — Draft product.json for VSCodium fork
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(__dirname, '../../../../');
const PRODUCT = join(ROOT, 'vscodium-build/product.json');
const DOC = join(ROOT, 'docs/VSCODIUM_FORK.md');

describe('2.3 product.json draft', () => {
  it('vscodium-build/product.json exists with branding fields', () => {
    expect(existsSync(PRODUCT)).toBe(true);
    const product = JSON.parse(readFileSync(PRODUCT, 'utf8')) as Record<string, string>;
    expect(product.nameShort).toBe('VoxelMap TestBed');
    expect(product.applicationName).toBe('voxelmap-testbed');
    expect(product.darwinBundleIdentifier).toBe('com.voxelmap.testbed');
    expect(product.urlProtocol).toBe('voxelmap-testbed');
  });

  it('VSCODIUM_FORK.md documents product.json location', () => {
    const doc = readFileSync(DOC, 'utf8');
    expect(doc).toContain('vscodium-build/product.json');
    expect(doc).toContain('nameShort');
    expect(doc).toContain('darwinBundleIdentifier');
  });
});
