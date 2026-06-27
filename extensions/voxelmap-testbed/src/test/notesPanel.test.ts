// Task ID: 1.2.5 — Notes panel
import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import {
  notesPanelHtml,
  readRunNotes,
  resolveRunNotesPath,
} from '../notes/notesPanel';
import { RunsTreeProvider } from '../providers/runsTreeProvider';
import { RunDataService } from '../run/runDataService';
import { MockDataProvider } from '../data/mockDataProvider';

const FIXTURES = resolve(__dirname, '../../../../fixtures');

describe('1.2.5 notesPanel', () => {
  const data = new MockDataProvider(FIXTURES);

  it('resolves notes.md path for demo run', () => {
    const p = resolveRunNotesPath(FIXTURES, 'exp_demo_baseline');
    expect(p).toContain('exp_demo_baseline/notes.md');
  });

  it('reads fixture notes content', () => {
    const md = readRunNotes(FIXTURES, 'exp_demo_baseline');
    expect(md).toContain('exp_demo_baseline');
    expect(md).toContain('Mock run notes');
  });

  it('renders notes panel html with run id', () => {
    const md = readRunNotes(FIXTURES, 'exp_demo_custom');
    const html = notesPanelHtml('exp_demo_custom', md);
    expect(html).toContain('exp_demo_custom');
    expect(html).toContain('Mock custom run');
  });

  it('Runs tree wires notes.md open command', () => {
    const runService = new RunDataService(data);
    const tree = new RunsTreeProvider(runService);
    const run = tree.getChildren().find((r) => r.label === 'exp_demo_baseline');
    const notes = tree.getChildren(run!).find((a) => a.label === 'notes.md');
    expect(notes?.command?.command).toBe('vmtb.notes.open');
    expect(notes?.command?.arguments).toEqual(['exp_demo_baseline']);
  });
});
