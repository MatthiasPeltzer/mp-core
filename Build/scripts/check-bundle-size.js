#!/usr/bin/env node
/**
 * Size-budget gate for the compiled mp-core bundles.
 *
 * Reads JS and CSS from `Resources/Public/{JavaScripts,StyleSheets}`,
 * computes gzip (level 9) and brotli (quality 11) sizes, compares against
 * the budgets defined in `bundle-budgets.json`, and prints a markdown-style
 * report. Exits 1 if any budget is exceeded, 0 otherwise.
 *
 * Intended to run from `npm run build` and from CI.
 */
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {brotliCompressSync, constants, gzipSync} from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildRoot = resolve(__dirname, '..');
const publicRoot = resolve(buildRoot, '../Resources/Public');
const budgetsPath = resolve(__dirname, 'bundle-budgets.json');

const KIB = 1024;

const budgets = JSON.parse(readFileSync(budgetsPath, 'utf8'));
const perFile = budgets.perFile ?? {};
const totals = budgets.totals ?? {};
const warnRatio = budgets.warnRatio ?? 0.9;

const dirs = [
  {kind: 'JS', dir: join(publicRoot, 'JavaScripts'), ext: '.js'},
  {kind: 'CSS', dir: join(publicRoot, 'StyleSheets'), ext: '.css'}
];

function formatBytes(n) {
  if (n < KIB) return `${n} B`;
  if (n < KIB * KIB) return `${(n / KIB).toFixed(1)} KiB`;
  return `${(n / KIB / KIB).toFixed(2)} MiB`;
}

function collectBundles() {
  const bundles = [];
  for (const {kind, dir, ext} of dirs) {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      continue;
    }
    for (const name of entries.sort()) {
      const full = join(dir, name);
      let stat;
      try {
        stat = statSync(full);
      } catch {
        continue;
      }
      if (!stat.isFile() || !name.endsWith(ext) || stat.size === 0) {
        continue;
      }
      const buf = readFileSync(full);
      bundles.push({
        kind,
        name,
        raw: buf.length,
        gzip: gzipSync(buf, {level: 9}).length,
        brotli: brotliCompressSync(buf, {
          params: {[constants.BROTLI_PARAM_QUALITY]: 11}
        }).length
      });
    }
  }
  return bundles;
}

function status(actual, budget) {
  if (budget === undefined || budget === null) return {label: '-', failed: false, warned: false};
  if (actual > budget) return {label: 'FAIL', failed: true, warned: false};
  if (actual > budget * warnRatio) return {label: 'WARN', failed: false, warned: true};
  return {label: 'OK', failed: false, warned: false};
}

const bundles = collectBundles();
if (bundles.length === 0) {
  console.error('[check-bundle-size] No bundles found. Did the build run?');
  process.exit(1);
}

let failed = false;
let warned = false;
const totalsActual = {gzip: 0, brotli: 0};
const rows = [];

for (const b of bundles) {
  totalsActual.gzip += b.gzip;
  totalsActual.brotli += b.brotli;
  const limit = perFile[b.name];
  const gzipStatus = status(b.gzip, limit?.gzip);
  const brotliStatus = status(b.brotli, limit?.brotli);
  if (gzipStatus.failed || brotliStatus.failed) failed = true;
  if (gzipStatus.warned || brotliStatus.warned) warned = true;
  rows.push({
    name: b.name,
    raw: formatBytes(b.raw),
    gzip: formatBytes(b.gzip),
    gzipBudget: limit?.gzip ? formatBytes(limit.gzip) : '-',
    gzipStatus: gzipStatus.label,
    brotli: formatBytes(b.brotli),
    brotliBudget: limit?.brotli ? formatBytes(limit.brotli) : '-',
    brotliStatus: brotliStatus.label
  });
}

const totalGzipStatus = status(totalsActual.gzip, totals.gzip);
const totalBrotliStatus = status(totalsActual.brotli, totals.brotli);
if (totalGzipStatus.failed || totalBrotliStatus.failed) failed = true;
if (totalGzipStatus.warned || totalBrotliStatus.warned) warned = true;

console.log('');
console.log('mp-core bundle size report');
console.log('==========================');
console.log('');
console.log('| Bundle | Raw | Gzip | Budget (gzip) | | Brotli | Budget (brotli) | |');
console.log('|---|---:|---:|---:|---|---:|---:|---|');
for (const r of rows) {
  console.log(
    `| ${r.name} | ${r.raw} | ${r.gzip} | ${r.gzipBudget} | ${r.gzipStatus} `
    + `| ${r.brotli} | ${r.brotliBudget} | ${r.brotliStatus} |`
  );
}
console.log(
  `| **total** | - | **${formatBytes(totalsActual.gzip)}** | `
  + `${totals.gzip ? formatBytes(totals.gzip) : '-'} | ${totalGzipStatus.label} `
  + `| **${formatBytes(totalsActual.brotli)}** | `
  + `${totals.brotli ? formatBytes(totals.brotli) : '-'} | ${totalBrotliStatus.label} |`
);
console.log('');

if (failed) {
  console.error('[check-bundle-size] FAIL — one or more bundles exceed their budget.');
  console.error('  Adjust the code, then update bundle-budgets.json only if the new size is justified.');
  process.exit(1);
}
if (warned) {
  console.warn('[check-bundle-size] WARN — one or more bundles are within 10% of their budget.');
}
console.log('[check-bundle-size] OK — all bundles within budget.');
