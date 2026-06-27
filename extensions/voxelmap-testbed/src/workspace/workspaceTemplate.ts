import * as fs from 'node:fs';
import * as path from 'node:path';

/** Relative paths inside workspace-template/ (source of truth). */
export const TEMPLATE_ENTRIES = [
  'README.md',
  'models/custom/README.md',
  'models/custom/example_model.py',
  'models/baselines/README.md',
  'modules/README.md',
  'experiments/smoke.yaml',
  'runs/.gitkeep',
] as const;

export interface InitWorkspaceResult {
  templateRoot: string;
  targetRoot: string;
  copied: string[];
  skipped: string[];
}

/** Resolve workspace-template/ directory (repo root or bundled with extension). */
export function resolveTemplateRoot(
  extensionPath: string,
  workspaceRoot?: string,
): string | undefined {
  const candidates: string[] = [];

  if (workspaceRoot) {
    candidates.push(path.join(workspaceRoot, 'workspace-template'));
  }

  candidates.push(
    path.join(extensionPath, 'workspace-template'),
    path.join(extensionPath, '..', '..', 'workspace-template'),
  );

  for (const dir of candidates) {
    if (isTemplateRoot(dir)) {
      return dir;
    }
  }

  return undefined;
}

export function isTemplateRoot(dir: string): boolean {
  return (
    fs.existsSync(path.join(dir, 'experiments', 'smoke.yaml')) &&
    fs.existsSync(path.join(dir, 'models', 'custom', 'README.md'))
  );
}

/** Copy template files into workspace root; skip existing paths. */
export function initWorkspaceFromTemplate(
  templateRoot: string,
  targetRoot: string,
): InitWorkspaceResult {
  const copied: string[] = [];
  const skipped: string[] = [];

  for (const rel of TEMPLATE_ENTRIES) {
    const src = path.join(templateRoot, rel);
    const dest = path.join(targetRoot, rel);

    if (!fs.existsSync(src)) {
      throw new Error(`Template file missing: ${rel}`);
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });

    if (fs.existsSync(dest)) {
      skipped.push(rel);
      continue;
    }

    fs.copyFileSync(src, dest);
    copied.push(rel);
  }

  return { templateRoot, targetRoot, copied, skipped };
}

/** Parse smoke.yaml fields required for Phase 1 mock experiments. */
export function parseSmokeExperimentYaml(content: string): {
  experiment_id: string;
  profile: string;
  gold_pack: string;
} {
  const experiment_id = matchYamlScalar(content, 'experiment_id');
  const profile = matchYamlNestedScalar(content, 'data', 'profile');
  const gold_pack = matchYamlNestedScalar(content, 'data', 'gold_pack');

  if (!experiment_id || !profile || !gold_pack) {
    throw new Error('smoke.yaml missing required fields');
  }

  return { experiment_id, profile, gold_pack };
}

function matchYamlScalar(content: string, key: string): string | undefined {
  const re = new RegExp(`^${key}:\\s*(.+)$`, 'm');
  return content.match(re)?.[1]?.trim();
}

function matchYamlNestedScalar(
  content: string,
  section: string,
  key: string,
): string | undefined {
  const sectionRe = new RegExp(`^${section}:\\s*$([\\s\\S]*?)(?=^[a-z_]+:|\\Z)`, 'm');
  const block = content.match(sectionRe)?.[1];
  if (!block) {
    return undefined;
  }
  const keyRe = new RegExp(`^  ${key}:\\s*(.+)$`, 'm');
  return block.match(keyRe)?.[1]?.trim();
}
