declare const __VMTB__: {
  profile: string;
  tableHtml: string;
};

const data = (window as unknown as { __VMTB__: typeof __VMTB__ }).__VMTB__;
const app = document.getElementById('app');
if (!app) {
  throw new Error('missing #app');
}

app.innerHTML = `<h2>Leaderboard — ${data.profile}</h2>${data.tableHtml}<p class="sub">* experiment run</p>`;
