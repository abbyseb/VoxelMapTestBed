import * as fs from 'node:fs';
import * as path from 'node:path';

export function resolveRunNotesPath(
  fixturesRoot: string,
  runId: string,
): string {
  return path.join(fixturesRoot, 'runs', runId, 'notes.md');
}

export function readRunNotes(fixturesRoot: string, runId: string): string {
  const notesPath = resolveRunNotesPath(fixturesRoot, runId);
  if (!fs.existsSync(notesPath)) {
    throw new Error(`notes.md not found for run ${runId}`);
  }
  return fs.readFileSync(notesPath, 'utf8');
}

export function notesPanelHtml(runId: string, markdown: string): string {
  const body = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '<br><br>');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: var(--vscode-font-family); padding: 16px;
      color: var(--vscode-foreground); line-height: 1.5; }
    h1 { font-size: 1.2em; }
    li { margin-left: 1em; }
  </style>
</head>
<body>
  <p><em>Run: ${runId}</em></p>
  ${body}
</body>
</html>`;
}
