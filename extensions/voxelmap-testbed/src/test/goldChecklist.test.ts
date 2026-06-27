// Task ID: 1.2.2 — Gold scan checklist + tag filter
import { describe, expect, it } from 'vitest';
import type { GoldScan } from '../data/types';
import {
  GoldChecklist,
  collectAllTags,
  filterScansByTags,
  scanIdsFromProfile,
} from '../gold/goldChecklist';

const SCANS: GoldScan[] = [
  {
    scan_id: 'MC_V_P1_NS_01',
    path: 'MC_V_P1_NS_01',
    split_roles: ['benchmark'],
    tags: ['mc', 'validation', 'ns', 'p1'],
  },
  {
    scan_id: 'MC_V_P1_NS_02',
    path: 'MC_V_P1_NS_02',
    split_roles: ['benchmark'],
    tags: ['mc', 'validation', 'ns', 'p1'],
  },
  {
    scan_id: 'MC_T_P2_SC',
    path: 'MC_T_P2_SC',
    split_roles: ['train'],
    tags: ['mc', 'training', 'sc', 'p2'],
  },
];

describe('1.2.2 goldChecklist', () => {
  it('collects sorted unique tags', () => {
    expect(collectAllTags(SCANS)).toEqual([
      'mc',
      'ns',
      'p1',
      'p2',
      'sc',
      'training',
      'validation',
    ]);
  });

  it('filters scans by AND tag match', () => {
    expect(filterScansByTags(SCANS, ['validation', 'ns']).map((s) => s.scan_id)).toEqual([
      'MC_V_P1_NS_01',
      'MC_V_P1_NS_02',
    ]);
    expect(filterScansByTags(SCANS, ['training']).map((s) => s.scan_id)).toEqual([
      'MC_T_P2_SC',
    ]);
    expect(filterScansByTags(SCANS, [])).toHaveLength(3);
  });

  it('tracks selected scans and profile defaults', () => {
    const checklist = new GoldChecklist(['MC_V_P1_NS_01']);
    expect(checklist.isSelected('MC_V_P1_NS_01')).toBe(true);
    expect(checklist.toggle('MC_V_P1_NS_02')).toBe(true);
    expect(checklist.getSelected()).toEqual(['MC_V_P1_NS_01', 'MC_V_P1_NS_02']);

    checklist.applyProfile({
      description: 'smoke',
      train: ['MC_V_P1_NS_01'],
      test: ['MC_V_P1_NS_02'],
    });
    expect(checklist.getSelected()).toEqual(['MC_V_P1_NS_01', 'MC_V_P1_NS_02']);
  });

  it('extracts scan ids from profile', () => {
    expect(
      scanIdsFromProfile({
        description: 'smoke',
        train: ['MC_V_P1_NS_01'],
        test: ['MC_V_P1_NS_02'],
      }),
    ).toEqual(['MC_V_P1_NS_01', 'MC_V_P1_NS_02']);
  });

  it('applies tag filter to checklist view', () => {
    const checklist = new GoldChecklist();
    checklist.setTagFilter(['validation']);
    expect(checklist.filterScans(SCANS).map((s) => s.scan_id)).toEqual([
      'MC_V_P1_NS_01',
      'MC_V_P1_NS_02',
    ]);
    checklist.clearTagFilter();
    expect(checklist.filterScans(SCANS)).toHaveLength(3);
  });
});
