declare const __VMTB__: {
  svg: string;
  epochs: number;
};

const data = (window as unknown as { __VMTB__: typeof __VMTB__ }).__VMTB__;
const app = document.getElementById('app');
if (!app) {
  throw new Error('missing #app');
}

app.innerHTML = `<h2>Train monitor</h2><p class="sub">${data.epochs} epochs (fixture replay)</p>${data.svg}`;
