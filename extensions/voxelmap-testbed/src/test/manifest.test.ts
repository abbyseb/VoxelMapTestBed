// Task ID: 1.1.4 — fixtures/manifest.yaml
import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  loadManifestFromFile,
  parseManifestYaml,
  validateManifest,
} from '../data/manifest';

const FIXTURES = resolve(__dirname, '../../../../fixtures');
const MANIFEST_PATH = join(FIXTURES, 'manifest.yaml');

describe('1.1.4 fixtures/manifest.yaml', () => {
  it('manifest file exists', () => {
    expect(existsSync(MANIFEST_PATH)).toBe(true);
  });

  it('parses BUILD_PLAN §3.4 shape', () => {
    const content = readFileSync(MANIFEST_PATH, 'utf8');
    const m = parseManifestYaml(content);
    validateManifest(m);

    expect(m.schema_version).toBe(1);
    expect(m.pack_id).toBe('spare-demo-v1');
    expect(m.scans).toHaveLength(5);
    expect(m.scans.map((s) => s.scan_id)).toEqual([
      'MC_V_P1_NS_01',
      'MC_V_P1_NS_02',
      'MC_T_P1_NS',
      'MC_T_P2_SC',
      'MC_T_P3_LD',
    ]);
  });

  it('smoke profile lists train and test scans', () => {
    const m = loadManifestFromFile(MANIFEST_PATH);
    expect(m.profiles.smoke.train).toEqual(['MC_V_P1_NS_01']);
    expect(m.profiles.smoke.test).toEqual(['MC_V_P1_NS_02']);
  });

  it('checksums cover both scans', () => {
    const m = loadManifestFromFile(MANIFEST_PATH);
    expect(m.checksums.MC_V_P1_NS_01).toMatch(/^sha256:/);
    expect(m.checksums.MC_V_P1_NS_02).toMatch(/^sha256:/);
    expect(m.checksums.MC_T_P3_LD).toMatch(/^sha256:/);
  });
});
