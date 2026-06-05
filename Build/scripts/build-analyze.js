#!/usr/bin/env node
/**
 * Cross-platform wrapper for `vite build --mode production` with the
 * `ANALYZE=1` env var set. Avoids pulling in `cross-env` as a devDependency.
 *
 * Run via `npm run build:analyze` from `Build/`. Output is written to
 * `Build/reports/bundle-stats.html` by rollup-plugin-visualizer.
 */
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildRoot = resolve(__dirname, '..');
const viteBin = resolve(buildRoot, 'node_modules/vite/bin/vite.js');

const child = spawn(
  process.execPath,
  [viteBin, 'build', '--mode', 'production'],
  {
    cwd: buildRoot,
    stdio: 'inherit',
    env: {...process.env, ANALYZE: '1'}
  }
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
