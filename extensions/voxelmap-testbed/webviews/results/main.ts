declare const __VMTB__: {
  runId: string;
  summary: { meanDice: number; meanPsnr: number; mean3dErrorMm: number; angleCount: number };
  table: string[][];
  gantrySvg: string;
  traceUri?: string;
};

const data = (window as unknown as { __VMTB__: typeof __VMTB__ }).__VMTB__;
const app = document.getElementById('app');
if (!app) {
  throw new Error('missing #app');
}

const tableRows = data.table
  .slice(1)
  .map(
    (row) =>
      `<tr>${row.map((c) => `<td>${c}</td>`).join('')}</tr>`,
  )
  .join('');

app.innerHTML = `
  <h2>Results — ${data.runId}</h2>
  <div class="grid">
    <div><div class="sub">Mean Dice</div><div class="metric">${data.summary.meanDice.toFixed(3)}</div></div>
    <div><div class="sub">Mean PSNR</div><div class="metric">${data.summary.meanPsnr.toFixed(1)}</div></div>
    <div><div class="sub">Mean 3D error</div><div class="metric">${data.summary.mean3dErrorMm.toFixed(2)} mm</div></div>
    <div><div class="sub">Gantry angles</div><div class="metric">${data.summary.angleCount}</div></div>
  </div>
  <h3>Polar gantry (Dice)</h3>
  <div>${data.gantrySvg}</div>
  ${
    data.traceUri
      ? `<h3>Performance trace</h3><img src="${data.traceUri}" alt="Performance trace" />`
      : ''
  }
  <h3>Per-angle metrics</h3>
  <table>
    <thead><tr>${data.table[0].map((h) => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
`;
