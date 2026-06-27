// Task ID: 1.2.1 — DemoDataProvider
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { DemoDataProvider } from '../data/demoDataProvider';
import { GoldTreeProvider } from '../providers/goldTreeProvider';
import { TestBedSession } from '../session/testBedSession';

const FIXTURES = resolve(__dirname, '../../../../fixtures');
const DEMO_ROOT = resolve(__dirname, '../../../../../DEMO');

describe('1.2.1 DemoDataProvider', () => {
  it('loads five scans when DEMO path exists', () => {
    if (!existsSync(DEMO_ROOT)) {
      return;
    }
    const provider = new DemoDataProvider(DEMO_ROOT, FIXTURES);
    expect(provider.mode).toBe('demo');
    expect(provider.getPackLabel()).toBe('spare-demo-v1');
    expect(provider.listScans()).toHaveLength(5);
    expect(provider.verifyGold().ok).toBe(true);
  });

  it('still lists fixture runs in demo mode', () => {
    if (!existsSync(DEMO_ROOT)) {
      return;
    }
    const provider = new DemoDataProvider(DEMO_ROOT, FIXTURES);
    expect(provider.listRuns().map((r) => r.runId)).toContain('exp_demo_baseline');
  });

  it('Gold tree shows demo badge and manifest version', () => {
    if (!existsSync(DEMO_ROOT)) {
      return;
    }
    const provider = new DemoDataProvider(DEMO_ROOT, FIXTURES);
    const session = new TestBedSession(provider);
    const tree = new GoldTreeProvider(provider, session);
    const pack = tree.getChildren()[0];
    expect(pack.label).toBe('spare-demo-v1');
    expect(pack.description).toContain('demo');
    const manifest = tree.getChildren(pack).find((c) => c.label === 'Manifest');
    expect(manifest?.description).toMatch(/^v1 ·/);
  });
});
