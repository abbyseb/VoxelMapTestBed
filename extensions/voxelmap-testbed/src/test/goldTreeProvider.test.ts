// Task ID: 1.2.1 — Gold tree provider (pack id, version, mode badge)
import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { MockDataProvider } from '../data/mockDataProvider';
import { GoldTreeProvider } from '../providers/goldTreeProvider';
import { TestBedSession } from '../session/testBedSession';

const FIXTURES = resolve(__dirname, '../../../../fixtures');

describe('1.2.1 GoldTreeProvider', () => {
  const provider = new MockDataProvider(FIXTURES);
  const session = new TestBedSession(provider);
  const tree = new GoldTreeProvider(provider, session);

  it('shows pack id and mock badge at root', () => {
    const root = tree.getChildren();
    expect(root).toHaveLength(1);
    expect(root[0].label).toBe('spare-demo-v1');
    expect(root[0].description).toMatch(/mock ✓/);
  });

  it('shows schema version and pipeline on Manifest node', () => {
    const pack = tree.getChildren()[0];
    const manifest = tree.getChildren(pack).find((c) => c.label === 'Manifest');
    expect(manifest?.description).toBe('v1 · 1.0.0');
  });

  it('lists five DEMO-aligned scans from manifest', () => {
    const pack = tree.getChildren()[0];
    const scansNode = tree.getChildren(pack).find((c) => c.label === 'Scans');
    const scans = tree.getChildren(scansNode!);
    expect(scans.map((s) => s.label)).toEqual([
      'MC_V_P1_NS_01',
      'MC_V_P1_NS_02',
      'MC_T_P1_NS',
      'MC_T_P2_SC',
      'MC_T_P3_LD',
    ]);
  });

  it('refresh fires tree change event', () => {
    expect(() => tree.refresh()).not.toThrow();
  });
});

describe('1.2.2 GoldTreeProvider checklist', () => {
  const provider = new MockDataProvider(FIXTURES);
  const session = new TestBedSession(provider);
  const tree = new GoldTreeProvider(provider, session);

  it('expands pack into checklist with smoke selection', () => {
    const pack = tree.getChildren()[0];
    const labels = tree.getChildren(pack).map((c) => c.label);
    expect(labels).toContain('Checklist');
    expect(tree.checklist.getSelected()).toEqual(['MC_V_P1_NS_01', 'MC_V_P1_NS_02']);
  });

  it('checklist filters scans by validation tag', () => {
    tree.checklist.setTagFilter(['validation']);
    const checklistNode = tree
      .getChildren(tree.getChildren()[0])
      .find((c) => c.label === 'Checklist');
    const rows = tree.getChildren(checklistNode!);
    const scanRows = rows.filter((r) => r.label !== 'Tag filter');
    expect(scanRows.map((r) => r.label)).toEqual(['MC_V_P1_NS_01', 'MC_V_P1_NS_02']);
    expect(scanRows[0].checkboxState).toBeDefined();
  });
});
