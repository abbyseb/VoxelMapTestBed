// Task ID: 2.1 — TestBed icon + color theme
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const EXT = resolve(__dirname, '../..');

describe('2.1 brand resources', () => {
  it('activity bar icon exists and is valid svg', () => {
    const icon = join(EXT, 'resources/testbed-icon.svg');
    expect(existsSync(icon)).toBe(true);
    const svg = readFileSync(icon, 'utf8');
    expect(svg).toContain('viewBox="0 0 24 24"');
    expect(svg).toContain('<svg');
  });

  it('package.json contributes VoxelMap TestBed color theme', () => {
    const pkg = JSON.parse(readFileSync(join(EXT, 'package.json'), 'utf8')) as {
      contributes: { themes: { label: string; path: string }[] };
      icon: string;
    };
    expect(pkg.icon).toContain('testbed-icon.svg');
    const theme = pkg.contributes.themes.find((t) => t.label === 'VoxelMap TestBed');
    expect(theme?.path).toBe('./themes/voxelmap-testbed-color-theme.json');
    const themePath = join(EXT, 'themes/voxelmap-testbed-color-theme.json');
    expect(existsSync(themePath)).toBe(true);
    const json = JSON.parse(readFileSync(themePath, 'utf8')) as { colors: Record<string, string> };
    expect(json.colors['activityBar.activeBorder']).toBeTruthy();
  });
});
