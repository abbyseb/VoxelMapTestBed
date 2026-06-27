import * as vscode from 'vscode';

const CSP = [
  "default-src 'none'",
  "img-src ${webview.cspSource} https: data:",
  "script-src 'unsafe-inline' ${webview.cspSource}",
  "style-src 'unsafe-inline' ${webview.cspSource}",
].join('; ');

export function buildWebviewDocument(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  options: {
    title: string;
    script: 'results.js' | 'leaderboard.js' | 'train.js';
    data: unknown;
    extraHead?: string;
  },
): string {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'dist', 'webviews', options.script),
  );
  const csp = CSP.replace(/\$\{webview.cspSource\}/g, webview.cspSource);
  const payload = JSON.stringify(options.data).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${options.title}</title>
  <style>
    body { font-family: var(--vscode-font-family); color: var(--vscode-foreground);
      background: var(--vscode-editor-background); margin: 0; padding: 12px; }
    h2,h3 { margin: 0 0 8px; font-weight: 600; }
    table { border-collapse: collapse; width: 100%; font-size: 13px; }
    th, td { border: 1px solid var(--vscode-panel-border); padding: 6px 8px; text-align: left; }
    th { background: var(--vscode-editor-inactiveSelectionBackground); }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    canvas, img { max-width: 100%; background: #111; border-radius: 4px; }
    .metric { font-size: 24px; font-weight: bold; }
    .sub { opacity: 0.8; font-size: 12px; }
  </style>
  ${options.extraHead ?? ''}
</head>
<body>
  <div id="app"></div>
  <script>window.__VMTB__ = ${payload};</script>
  <script src="${scriptUri}"></script>
</body>
</html>`;
}
