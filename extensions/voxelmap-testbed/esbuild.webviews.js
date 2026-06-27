//@ts-check
const esbuild = require('esbuild');

const production = process.argv.includes('--production');

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: {
    results: 'webviews/results/main.ts',
    leaderboard: 'webviews/leaderboard/main.ts',
    train: 'webviews/train/main.ts',
  },
  bundle: true,
  outdir: 'dist/webviews',
  format: 'iife',
  platform: 'browser',
  sourcemap: !production,
  minify: production,
  logLevel: 'info',
};

async function main() {
  await esbuild.build(buildOptions);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
