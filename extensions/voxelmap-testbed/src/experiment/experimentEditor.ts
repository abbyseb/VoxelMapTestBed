/** Minimal experiment YAML fields for Phase 1 editor (no external yaml lib). */
export interface ExperimentSpec {
  experiment_id: string;
  name: string;
  profile: string;
  gold_pack: string;
  model_entry: string;
  use_film: boolean;
  epochs: number;
  raw: string;
}

export function parseExperimentYaml(content: string): ExperimentSpec {
  const line = (key: string): string | undefined => {
    const m = content.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return m?.[1]?.trim();
  };
  const nested = (parent: string, key: string): string | undefined => {
    const m = content.match(new RegExp(`^  ${key}:\\s*(.+)$`, 'm'));
    if (m && content.includes(`${parent}:`)) {
      return m[1]?.trim();
    }
    return undefined;
  };

  const profile =
    nested('data', 'profile') ??
    line('profile') ??
    'smoke';
  const gold_pack = nested('data', 'gold_pack') ?? 'spare-demo-v1';
  const model_entry =
    content.match(/^  entry:\s*(.+)$/m)?.[1]?.trim() ??
    'models.baselines.concatenated:build';
  const use_film = /use_film:\s*true/.test(content);

  return {
    experiment_id: line('experiment_id') ?? 'exp_preview',
    name: line('name') ?? 'preview',
    profile,
    gold_pack,
    model_entry,
    use_film,
    epochs: Number(nested('train', 'epochs') ?? 20),
    raw: content,
  };
}

export function validateExperimentSpec(spec: ExperimentSpec): string[] {
  const errors: string[] = [];
  if (!spec.experiment_id) {
    errors.push('experiment_id is required');
  }
  if (!spec.name) {
    errors.push('name is required');
  }
  if (!spec.profile) {
    errors.push('profile is required');
  }
  if (spec.epochs < 1) {
    errors.push('epochs must be >= 1');
  }
  return errors;
}

export function applySpecToYaml(baseYaml: string, spec: Partial<ExperimentSpec>): string {
  let yaml = baseYaml;
  const replace = (key: string, value: string) => {
    const re = new RegExp(`^${key}:.*$`, 'm');
    if (re.test(yaml)) {
      yaml = yaml.replace(re, `${key}: ${value}`);
    }
  };
  const replaceNested = (section: string, key: string, value: string) => {
    const re = new RegExp(`(^${section}:[\\s\\S]*?^  ${key}:).*$`, 'm');
    if (re.test(yaml)) {
      yaml = yaml.replace(re, `$1 ${value}`);
    }
  };

  if (spec.experiment_id !== undefined) {
    replace('experiment_id', spec.experiment_id);
  }
  if (spec.name !== undefined) {
    replace('name', spec.name);
  }
  if (spec.profile !== undefined) {
    replaceNested('data', 'profile', spec.profile);
  }
  if (spec.epochs !== undefined) {
    replaceNested('train', 'epochs', String(spec.epochs));
  }
  if (spec.use_film !== undefined) {
    yaml = yaml.replace(/^    use_film:.*$/m, `    use_film: ${spec.use_film}`);
  }
  return yaml;
}

export function experimentEditorHtml(yaml: string, errors: string[]): string {
  const errHtml =
    errors.length > 0
      ? `<p class="err">${errors.map((e) => escapeHtml(e)).join('<br>')}</p>`
      : '';
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: var(--vscode-font-family); padding: 12px; color: var(--vscode-foreground); }
    textarea { width: 100%; height: 70vh; font-family: var(--vscode-editor-font-family); font-size: 13px;
      background: var(--vscode-editor-background); color: var(--vscode-editor-foreground);
      border: 1px solid var(--vscode-input-border); }
    button { margin-top: 8px; margin-right: 8px; }
    .err { color: var(--vscode-errorForeground); }
  </style>
</head>
<body>
  <h3>Experiment YAML</h3>
  ${errHtml}
  <textarea id="yaml">${escapeHtml(yaml)}</textarea>
  <div>
    <button id="apply">Apply to preview</button>
    <button id="reload">Reload from preview</button>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    document.getElementById('apply').onclick = () => {
      vscode.postMessage({ type: 'apply', yaml: document.getElementById('yaml').value });
    };
    document.getElementById('reload').onclick = () => {
      vscode.postMessage({ type: 'reload' });
    };
    window.addEventListener('message', (e) => {
      if (e.data.type === 'update') {
        document.getElementById('yaml').value = e.data.yaml;
      }
      if (e.data.type === 'errors') {
        // errors shown on next full refresh from extension
      }
    });
  </script>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
