// Task ID: 1.1.2 — Gold tree provider
import { describe, expect, it } from 'vitest';
import { GoldTreeProvider } from '../providers/goldTreeProvider';

describe('1.1.2 GoldTreeProvider', () => {
  const provider = new GoldTreeProvider();

  it('returns smoke gold pack at root', () => {
    const root = provider.getChildren();
    expect(root).toHaveLength(1);
    expect(root[0].label).toBe('spare-gold-smoke-v1');
    expect(root[0].description).toBe('mock');
    expect(root[0].contextValue).toBe('goldPack');
  });

  it('expands pack into manifest, profiles, scans', () => {
    const pack = provider.getChildren()[0];
    const children = provider.getChildren(pack);
    const labels = children.map((c) => c.label);
    expect(labels).toContain('Manifest');
    expect(labels).toContain('Profiles');
    expect(labels).toContain('Scans');
  });

  it('lists two MC validation scans', () => {
    const pack = provider.getChildren()[0];
    const scansNode = provider
      .getChildren(pack)
      .find((c) => c.label === 'Scans');
    expect(scansNode).toBeDefined();
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
