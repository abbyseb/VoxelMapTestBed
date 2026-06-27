import * as fs from 'node:fs';
import * as path from 'node:path';
import type { GoldScan } from './types';
import { isAppleDoubleEntry } from './fsUtil';

export interface CaseManifest {
  case_id: string;
  validation?: { ok?: boolean; projection_count?: number };
}

/** Infer SPARE-style tags from a scan folder name (e.g. MC_V_P1_NS_01). */
export function inferTagsFromScanId(scanId: string): string[] {
  const tags = ['mc'];
  if (scanId.startsWith('MC_V_')) {
    tags.push('validation');
  }
  if (scanId.startsWith('MC_T_')) {
    tags.push('training');
  }
  const patient = scanId.match(/_P(\d+)_/);
  if (patient) {
    tags.push(`p${patient[1]}`);
  }
  if (scanId.includes('_NS')) {
    tags.push('ns');
  }
  if (scanId.includes('_SC')) {
    tags.push('sc');
  }
  if (scanId.includes('_LD')) {
    tags.push('ld');
  }
  return tags;
}

export function inferSplitRoles(scanId: string): string[] {
  if (scanId.startsWith('MC_T_')) {
    return ['train'];
  }
  return ['benchmark'];
}

export function scanFromCaseId(scanId: string): GoldScan {
  return {
    scan_id: scanId,
    path: scanId,
    split_roles: inferSplitRoles(scanId),
    tags: inferTagsFromScanId(scanId),
  };
}

export function loadCaseManifest(caseDir: string): CaseManifest | undefined {
  const manifestPath = path.join(caseDir, 'case_manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return undefined;
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as CaseManifest;
}

/** Discover preprocessed cases under a DEMO root (one folder per scan_id). */
export function loadDemoScans(demoRoot: string): GoldScan[] {
  if (!fs.existsSync(demoRoot)) {
    return [];
  }

  return fs
    .readdirSync(demoRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && !isAppleDoubleEntry(d.name))
    .filter((d) =>
      fs.existsSync(path.join(demoRoot, d.name, 'case_manifest.json')),
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((d) => scanFromCaseId(d.name));
}

export function verifyDemoCases(
  demoRoot: string,
  scans: GoldScan[],
): { ok: boolean; message: string } {
  if (!fs.existsSync(demoRoot)) {
    return { ok: false, message: `demo path not found: ${demoRoot}` };
  }

  const failures: string[] = [];
  for (const scan of scans) {
    const caseDir = path.join(demoRoot, scan.scan_id);
    const manifest = loadCaseManifest(caseDir);
    if (!manifest) {
      failures.push(`${scan.scan_id} (no case_manifest.json)`);
      continue;
    }
    if (manifest.validation?.ok !== true) {
      failures.push(`${scan.scan_id} (validation not ok)`);
    }
  }

  if (failures.length > 0) {
    return {
      ok: false,
      message: `demo ✗ ${failures.join('; ')}`,
    };
  }

  return {
    ok: true,
    message: `demo ✓ ${scans.length} case(s) on disk`,
  };
}
