// Task ID: 1.2.1 — demo scan discovery
import { describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  inferSplitRoles,
  inferTagsFromScanId,
  loadDemoScans,
  verifyDemoCases,
} from '../data/demoScans';

function writeCase(root: string, caseId: string, ok = true): void {
  const dir = join(root, caseId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'case_manifest.json'),
    JSON.stringify({
      case_id: caseId,
      validation: { ok, projection_count: 680 },
    }),
  );
}

describe('1.2.1 demoScans', () => {
  it('infers validation vs training tags from scan id', () => {
    expect(inferTagsFromScanId('MC_V_P1_NS_01')).toEqual(
      expect.arrayContaining(['mc', 'validation', 'ns', 'p1']),
    );
    expect(inferTagsFromScanId('MC_T_P2_SC')).toEqual(
      expect.arrayContaining(['mc', 'training', 'sc', 'p2']),
    );
  });

  it('infers split roles from scan id', () => {
    expect(inferSplitRoles('MC_V_P1_NS_01')).toEqual(['benchmark']);
    expect(inferSplitRoles('MC_T_P1_NS')).toEqual(['train']);
  });

  it('discovers cases with case_manifest.json only', () => {
    const root = join(tmpdir(), `vmtb-demo-${Date.now()}`);
    mkdirSync(root, { recursive: true });
    try {
      writeCase(root, 'MC_V_P1_NS_01');
      writeCase(root, 'MC_T_P1_NS');
      mkdirSync(join(root, 'not_a_case'));
      const scans = loadDemoScans(root);
      expect(scans.map((s) => s.scan_id)).toEqual(['MC_T_P1_NS', 'MC_V_P1_NS_01']);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('verifyDemoCases fails when validation not ok', () => {
    const root = join(tmpdir(), `vmtb-demo-bad-${Date.now()}`);
    mkdirSync(root, { recursive: true });
    try {
      writeCase(root, 'MC_V_P1_NS_01', false);
      const scans = loadDemoScans(root);
      const result = verifyDemoCases(root, scans);
      expect(result.ok).toBe(false);
      expect(result.message).toContain('validation not ok');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
