import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join, extname} from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const dirs = [
  join(root, 'Build/Assets'),
  join(root, 'Resources/Private'),
  join(root, 'Resources/Extensions'),
  join(root, 'ContentBlocks'),
];

const exts = new Set(['.html', '.js', '.vue', '.scss']);

const reps = [
  [/show\.bs\.dropdown/g, 'show.bs.menu'],
  [/hide\.bs\.dropdown/g, 'hide.bs.menu'],
  [/data-bs-toggle="dropdown"/g, 'data-bs-toggle="menu"'],
  [/data-bs-dismiss="modal"/g, 'data-bs-dismiss="dialog"'],
  [/data-bs-toggle="modal"/g, 'data-bs-toggle="dialog"'],
  [/dropdown-menu/g, 'menu'],
  [/dropdown-item/g, 'menu-item'],
  [/dropdown-divider/g, 'menu-divider'],
  [/btn-outline-primary/g, 'btn-outline theme-primary'],
  [/btn-outline-secondary/g, 'btn-outline theme-secondary'],
  [/btn-primary/g, 'btn-solid theme-primary'],
  [/btn-secondary/g, 'btn-solid theme-secondary'],
  [/text-muted/g, 'fg-secondary'],
  [/form-select/g, 'form-control'],
  [/data-bs-popper="static"/g, ''],
  [/\bdropstart\b/g, ''],
];

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
      for (const [from, to] of reps) {
        text = text.replace(from, to);
      }
      if (text !== orig) {
        writeFileSync(p, text);
      }
    }
  }
}

for (const dir of dirs) {
  walk(dir);
}

console.log('Bootstrap 6 renames applied.');
