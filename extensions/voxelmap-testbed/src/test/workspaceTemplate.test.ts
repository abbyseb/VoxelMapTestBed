// Task ID: 1.1.3 — Sample workspace template
import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import {
  TEMPLATE_ENTRIES,
  initWorkspaceFromTemplate,
  isTemplateRoot,
  parseSmokeExperimentYaml,
  resolveTemplateRoot,
} from '../workspace/workspaceTemplate';

const REPO_TEMPLATE = resolve(__dirname, '../../../../workspace-template');
const EXT_ROOT = resolve(__dirname, '../..');

describe('1.1.3 workspace template', () => {
  it('repo workspace-template/ exists with required paths', () => {
    expect(isTemplateRoot(REPO_TEMPLATE)).toBe(true);
    expect(existsSync(join(REPO_TEMPLATE, 'models', 'custom'))).toBe(true);
    expect(existsSync(join(REPO_TEMPLATE, 'experiments', 'smoke.yaml'))).toBe(
      true,
    );
  });

  it('lists all template entries on disk', () => {
    for (const rel of TEMPLATE_ENTRIES) {
      expect(existsSync(join(REPO_TEMPLATE, rel))).toBe(true);
    }
  });

  it('smoke.yaml has required experiment fields', () => {
    const content = readFileSync(
      join(REPO_TEMPLATE, 'experiments', 'smoke.yaml'),
      'utf8',
    );
    const parsed = parseSmokeExperimentYaml(content);
    expect(parsed.experiment_id).toBe('exp_smoke_baseline');
    expect(parsed.profile).toBe('smoke');
    expect(parsed.gold_pack).toBe('spare-gold-smoke-v1');
  });

  it('resolveTemplateRoot finds repo template from extension path', () => {
    const root = resolveTemplateRoot(EXT_ROOT);
    expect(root).toBeDefined();
    expect(isTemplateRoot(root!)).toBe(true);
  });

  it('initWorkspaceFromTemplate copies files into empty directory', () => {
    const temp = mkdtempSync(join(tmpdir(), 'vmtb-ws-'));
    try {
      const result = initWorkspaceFromTemplate(REPO_TEMPLATE, temp);
      expect(result.copied.length).toBe(TEMPLATE_ENTRIES.length);
      expect(existsSync(join(temp, 'experiments', 'smoke.yaml'))).toBe(true);
      expect(existsSync(join(temp, 'models', 'custom', 'example_model.py'))).toBe(
        true,
      );
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  });

  it('initWorkspaceFromTemplate skips existing files', () => {
    const temp = mkdtempSync(join(tmpdir(), 'vmtb-ws-'));
    try {
      initWorkspaceFromTemplate(REPO_TEMPLATE, temp);
      const second = initWorkspaceFromTemplate(REPO_TEMPLATE, temp);
      expect(second.copied).toHaveLength(0);
      expect(second.skipped.length).toBe(TEMPLATE_ENTRIES.length);
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  });
});
