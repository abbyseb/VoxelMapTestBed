import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import type { GoldManifest, GoldProfile } from './types';

/** Minimal YAML parse for manifest (no external deps). Supports BUILD_PLAN §3.4 shape. */
export function parseManifestYaml(content: string): GoldManifest {
  const lines = content.split('\n');
  const root: Record<string, unknown> = {};
  let listItem: Record<string, unknown> | null = null;
  let profileKey: string | null = null;
  let profileObj: GoldProfile | null = null;
  let inProfiles = false;
  let inScans = false;
  let inDatasets = false;
  let inChecksums = false;
  let inPreprocessing = false;

  const scans: GoldManifest['scans'] = [];
  const datasets: GoldManifest['datasets'] = [];
  const profiles: GoldManifest['profiles'] = {};
  const checksums: Record<string, string> = {};
  const preprocessing: GoldManifest['preprocessing'] = {
    pipeline_version: '',
    learn_gui_commit: '',
    grid_size: 128,
    spare_password_applied: false,
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line || line.startsWith('#')) {
      continue;
    }

    if (line === 'preprocessing:') {
      inPreprocessing = true;
      inProfiles = inScans = inDatasets = inChecksums = false;
      continue;
    }
    if (line === 'datasets:') {
      inDatasets = true;
      inPreprocessing = inProfiles = inScans = inChecksums = false;
      continue;
    }
    if (line === 'scans:') {
      inScans = true;
      inPreprocessing = inProfiles = inDatasets = inChecksums = false;
      continue;
    }
    if (line === 'profiles:') {
      inProfiles = true;
      inPreprocessing = inScans = inDatasets = inChecksums = false;
      continue;
    }
    if (line === 'checksums:') {
      inChecksums = true;
      inPreprocessing = inProfiles = inScans = inDatasets = false;
      continue;
    }

    const top = line.match(/^([a-z_]+):\s*(.*)$/);
    if (top && !line.startsWith('  ') && !line.startsWith('-')) {
      inPreprocessing = inProfiles = inScans = inDatasets = inChecksums = false;
      root[top[1]] = parseScalar(top[2]);
      continue;
    }

    if (inPreprocessing) {
      const m = line.match(/^  ([a-z_]+):\s*(.*)$/);
      if (m) {
        const key = m[1];
        const val = parseScalar(m[2]);
        if (key === 'grid_size') {
          preprocessing.grid_size = Number(val);
        } else if (key === 'spare_password_applied') {
          preprocessing.spare_password_applied = val === true || val === 'true';
        } else if (key === 'pipeline_version') {
          preprocessing.pipeline_version = String(val);
        } else if (key === 'learn_gui_commit') {
          preprocessing.learn_gui_commit = String(val);
        }
      }
      continue;
    }

    if (inDatasets && line.startsWith('- id:')) {
      const id = line.replace('- id:', '').trim();
      datasets.push({
        id,
        source: 'SPARE_PublicArchive',
        patients_independent: true,
      });
      continue;
    }

    if (inScans && /^\s*-\s*scan_id:/.test(line)) {
      listItem = { scan_id: line.replace(/^\s*-\s*scan_id:/, '').trim() };
      continue;
    }
    if (inScans && listItem && /^\s+path:/.test(line)) {
      listItem.path = line.replace(/^\s+path:/, '').trim();
      continue;
    }
    if (inScans && listItem && /^\s+split_roles:/.test(line)) {
      listItem.split_roles = parseInlineArray(line.split(':').slice(1).join(':'));
      continue;
    }
    if (inScans && listItem && /^\s+tags:/.test(line)) {
      listItem.tags = parseInlineArray(line.split(':').slice(1).join(':'));
      scans.push({
        scan_id: String(listItem.scan_id),
        path: String(listItem.path),
        split_roles: listItem.split_roles as string[],
        tags: listItem.tags as string[],
      });
      listItem = null;
      continue;
    }

    if (inProfiles) {
      const pk = line.match(/^  ([a-z_]+):$/);
      if (pk) {
        profileKey = pk[1];
        profileObj = { description: '' };
        profiles[profileKey] = profileObj;
        continue;
      }
      if (profileKey && profileObj) {
        const pm = line.match(/^    ([a-z_]+):\s*(.*)$/);
        if (pm) {
          const k = pm[1];
          const v = pm[2].trim();
          if (k === 'description') {
            profileObj.description = String(parseScalar(v));
          } else if (k === 'train' || k === 'test') {
            profileObj[k] = v.startsWith('[')
              ? parseInlineArray(v)
              : [String(parseScalar(v))];
          }
        }
      }
      continue;
    }

    if (inChecksums) {
      const cm = line.match(/^  ([A-Z0-9_]+):\s*(.+)$/);
      if (cm) {
        checksums[cm[1]] = cm[2].trim();
      }
    }
  }

  return {
    schema_version: Number(root.schema_version ?? 1),
    pack_id: String(root.pack_id ?? ''),
    created: String(root.created ?? ''),
    preprocessing,
    datasets,
    scans,
    profiles,
    checksums,
  };
}

export function loadManifestFromFile(manifestPath: string): GoldManifest {
  const content = fs.readFileSync(manifestPath, 'utf8');
  return parseManifestYaml(content);
}

export function validateManifest(m: GoldManifest): void {
  if (m.schema_version !== 1) {
    throw new Error(`Unsupported schema_version: ${m.schema_version}`);
  }
  if (!m.pack_id) {
    throw new Error('manifest missing pack_id');
  }
  if (m.scans.length < 1) {
    throw new Error('manifest must list at least one scan');
  }
  if (!m.profiles.smoke) {
    throw new Error('manifest missing smoke profile');
  }
}

function parseScalar(raw: string): string | number | boolean {
  const v = raw.trim();
  if (v === 'true') {
    return true;
  }
  if (v === 'false') {
    return false;
  }
  if (/^\d+$/.test(v)) {
    return Number(v);
  }
  return v.replace(/^["']|["']$/g, '');
}

function parseInlineArray(raw: string): string[] {
  return raw
    .replace(/[\[\]]/g, '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function resolveFixturesRoot(
  extensionPath: string,
  workspaceRoot?: string,
  overridePath?: string,
): string | undefined {
  const candidates: string[] = [];

  if (overridePath) {
    candidates.push(overridePath);
  }
  if (workspaceRoot) {
    candidates.push(path.join(workspaceRoot, 'fixtures'));
  }
  candidates.push(
    path.join(extensionPath, '..', '..', 'fixtures'),
    path.join(extensionPath, 'fixtures'),
  );

  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'manifest.yaml'))) {
      return dir;
    }
  }
  return undefined;
}

export function getFixturesRootFromConfig(
  extensionPath: string,
): string | undefined {
  const cfg = vscode.workspace.getConfiguration('vmtb');
  const override = cfg.get<string>('fixturesPath', '').trim();
  const ws = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  return resolveFixturesRoot(extensionPath, ws, override || undefined);
}
