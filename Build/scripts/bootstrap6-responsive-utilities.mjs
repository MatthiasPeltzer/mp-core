import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, extname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const dirs = [
  join(root, 'Build/Assets'),
  join(root, 'Resources/Private'),
  join(root, 'Resources/Extensions'),
  join(root, 'ContentBlocks'),
  join(root, 'Resources/Private/Backend'),
];

const exts = new Set(['.html', '.js', '.vue']);

const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', 'xxl'];

function v6Breakpoint(bp) {
  return bp === 'xxl' ? '2xl' : bp;
}

function migrateResponsiveUtilities(text) {
  let out = text;

  for (const bp of BREAKPOINTS) {
    const v6 = v6Breakpoint(bp);
    const reBp = bp === 'xxl' ? 'xxl' : bp;

    out = out.replace(new RegExp(`\\bcol-${reBp}-(\\d+)\\b`, 'g'), `${v6}:col-$1`);
    out = out.replace(new RegExp(`\\boffset-${reBp}-(\\d+)\\b`, 'g'), `${v6}:offset-$1`);
    out = out.replace(new RegExp(`\\border-${reBp}-(\\d+)\\b`, 'g'), `${v6}:order-$1`);
    out = out.replace(new RegExp(`\\brow-cols-${reBp}-(\\d+)\\b`, 'g'), `${v6}:row-cols-$1`);
    out = out.replace(new RegExp(`\\bcontainer-${reBp}\\b`, 'g'), `${v6}:container`);
    out = out.replace(new RegExp(`\\bd-${reBp}-([a-z][\\w-]*)\\b`, 'g'), `${v6}:d-$1`);
    out = out.replace(new RegExp(`\\bgx-${reBp}-(\\d+)\\b`, 'g'), `${v6}:gx-$1`);
    out = out.replace(new RegExp(`\\bgy-${reBp}-(\\d+)\\b`, 'g'), `${v6}:gy-$1`);
    out = out.replace(new RegExp(`\\bg-${reBp}-(\\d+)\\b`, 'g'), `${v6}:g-$1`);
    out = out.replace(new RegExp(`\\bcol-${reBp}\\b(?!-)`, 'g'), `${v6}:col`);
  }

  return out;
}

function walk(dir) {
  for (const ent of readdirSync(dir, {withFileTypes: true})) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === 'Public') {
        continue;
      }
      walk(p);
    } else if (exts.has(extname(ent.name)) || ent.name.endsWith('.fluid.html')) {
      let text = readFileSync(p, 'utf8');
      const orig = text;
      text = migrateResponsiveUtilities(text);
      if (text !== orig) {
        writeFileSync(p, text);
      }
    }
  }
}

for (const dir of dirs) {
  walk(dir);
}

console.log('Bootstrap 6 responsive utilities applied.');
