declare function acquireVsCodeApi(): { postMessage(msg: unknown): void };

declare const __VMTB__: {
  modeBadge: string;
  modeMessage: string;
  packHint: string;
  steps: Array<{ label: string; command: string; description: string }>;
};

const vscodeApi = acquireVsCodeApi();
const data = (window as unknown as { __VMTB__: typeof __VMTB__ }).__VMTB__;
const app = document.getElementById('app');
if (!app) {
  throw new Error('missing #app');
}

const steps = data.steps
  .map(
    (s) =>
      `<li><button class="step" data-cmd="${s.command}">${s.label}</button>` +
      `<span class="sub"> — ${s.description}</span></li>`,
  )
  .join('');

app.innerHTML = `
  <h2>VoxelMap TestBed</h2>
  <p><span class="badge">${data.modeBadge}</span> ${data.modeMessage}</p>
  <p class="sub">${data.packHint}</p>
  <h3>Quick start</h3>
  <ol class="steps">${steps}</ol>
  <p class="sub">Open the cube icon on the activity bar for Gold, Experiments, Runs, and Leaderboard.</p>
`;

document.querySelectorAll('button.step').forEach((btn) => {
  btn.addEventListener('click', () => {
    const cmd = (btn as HTMLButtonElement).dataset.cmd;
    if (cmd) {
      vscodeApi.postMessage({ command: cmd });
    }
  });
});

const style = document.createElement('style');
style.textContent = `
  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px;
    background: var(--vscode-badge-background); color: var(--vscode-badge-foreground);
    font-weight: 600; text-transform: uppercase; font-size: 11px; }
  .steps { padding-left: 1.2em; }
  .step { margin-right: 6px; cursor: pointer; }
`;
document.head.appendChild(style);
