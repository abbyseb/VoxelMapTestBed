// Task ID: 1.2.3 — Profile picker smoke / custom + experiment preview
import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { loadManifestFromFile } from '../data/manifest';
import { MockDataProvider } from '../data/mockDataProvider';
import {
  buildExperimentPreviewYaml,
  listProfilePickerOptions,
} from '../gold/experimentPreview';
import { ExperimentsTreeProvider } from '../providers/experimentsTreeProvider';
import { GoldTreeProvider } from '../providers/goldTreeProvider';
import { TestBedSession } from '../session/testBedSession';

const FIXTURES = resolve(__dirname, '../../../../fixtures');
const MANIFEST = loadManifestFromFile(resolve(FIXTURES, 'manifest.yaml'));

describe('1.2.3 profile picker', () => {
  const data = new MockDataProvider(FIXTURES);
  const session = new TestBedSession(data);

  it('lists smoke, train_mix, and custom profile options', () => {
    const options = listProfilePickerOptions(MANIFEST);
    expect(options.map((o) => o.id)).toEqual(['smoke', 'train_mix', 'custom']);
  });

  it('builds preview yaml for smoke profile', () => {
    session.applyProfile('smoke');
    const yaml = session.getExperimentYaml();
    expect(yaml).toContain('profile: smoke');
    expect(yaml).toContain('gold_pack: spare-demo-v1');
    expect(yaml).toContain('MC_V_P1_NS_01');
    expect(yaml).toContain('MC_V_P1_NS_02');
  });

  it('builds preview yaml for train_mix profile', () => {
    const yaml = buildExperimentPreviewYaml({
      packId: 'spare-demo-v1',
      profileId: 'train_mix',
      customScans: [],
      manifest: MANIFEST,
    });
    expect(yaml).toContain('profile: train_mix');
    expect(yaml).toContain('MC_T_P1_NS');
    expect(yaml).toContain('MC_T_P2_SC');
  });

  it('custom profile uses checklist selection in preview', () => {
    session.applyProfile('custom');
    session.checklist.setSelected('MC_T_P3_LD', true);
    session.onChecklistChanged();
    const yaml = session.getExperimentYaml();
    expect(yaml).toContain('profile: custom');
    expect(yaml).toContain('MC_T_P3_LD');
  });

  it('applyProfile updates checklist for smoke', () => {
    session.applyProfile('train_mix');
    expect(session.activeProfileId).toBe('train_mix');
    expect(session.checklist.getSelected()).toEqual([
      'MC_T_P1_NS',
      'MC_T_P2_SC',
      'MC_V_P1_NS_01',
    ]);
  });

  it('Experiments tree shows preview with active profile', () => {
    session.applyProfile('train_mix');
    const tree = new ExperimentsTreeProvider(data, session);
    const root = tree.getChildren();
    expect(root[0].label).toBe('Experiment preview');
    expect(root[0].description).toBe('profile: train_mix');
  });

  it('Gold profiles node shows active profile', () => {
    session.applyProfile('smoke');
    const gold = new GoldTreeProvider(data, session);
    const profiles = gold
      .getChildren(gold.getChildren()[0])
      .find((n) => n.label === 'Profiles');
    expect(profiles?.description).toBe('active: smoke');
  });
});
