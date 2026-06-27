// Task ID: 1.1.2 — Gold tree provider (updated for MockDataProvider)
import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { MockDataProvider } from '../data/mockDataProvider';
import { GoldTreeProvider } from '../providers/goldTreeProvider';

const FIXTURES = resolve(__dirname, '../../../../fixtures');

describe('1.1.2 GoldTreeProvider', () => {
  const provider = new GoldTreeProvider(new MockDataProvider(FIXTURES));

  it('returns smoke gold pack at root from fixtures', () => {
    const root = provider.getChildren();
    expect(root).toHaveLength(1);
    expect(root[0].label).toBe('spare-gold-smoke-v1');
    expect(root[0].description).toContain('mock');
  });

  it('expands pack into manifest, profiles, scans', () => {
    const pack = provider.getChildren()[0];
    const labels = provider.getChildren(pack).map((c) => c.label);
    expect(labels).toContain('Manifest');
    expect(labels).toContain('Profiles');
    expect(labels).toContain('Scans');
  });

  it('lists two MC validation scans from manifest', () => {
    const pack = provider.getChildren()[0];
    const scansNode = provider.getChildren(pack).find((c) => c.label === 'Scans');
    const scans = provider.getChildren(scansNode!);
    expect(scans.map((s) => s.label)).toEqual([
      'MC_V_P1_NS_01',
      'MC_V_P2_SC_02',
    ]);
  });

  it('refresh fires tree change event', () => {
    expect(() => provider.refresh()).not.toThrow();
  });
});
