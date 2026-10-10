import {readdirSync, readFileSync} from 'node:fs';
import {join, extname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const scanDirs = [
  join(root, 'Build/Assets'),
  join(root, 'Resources/Private'),
  join(root, 'Resources/Extensions'),
  join(root, 'ContentBlocks'),
  join(root, 'Configuration'),
];

const scanExts = new Set(['.html', '.js', '.vue', '.scss', '.yaml', '.php', '.typoscript']);

/** Patterns that must not appear in source (DB migration wizards handle stored content separately). */
const FORBIDDEN = [
  {id: 'col-md', re: /\bcol-(sm|md|lg|xl|xxl)-/},
  {id: 'data-bs-popper', re: /data-bs-popper/},
  {id: 'dropstart', re: /\bdrop(start|end|up)\b/},
  {id: 'dropdown-hook', re: /\bdropdown-/},
  {id: 'dropdown-toggle', re: /data-bs-toggle="dropdown"/},
  {id: 'modal-toggle', re: /data-bs-toggle="modal"/},
  {id: 'modal-class', re: /\bmodal-(dialog|header|body|footer|backdrop|fullscreen)\b/},
  {id: 'modal-content-class', re: /\bmodal-content\b(?!-)/},
  {id: 'modal-dismiss', re: /data-bs-dismiss="modal"/},
  {id: 'carousel-control-class', re: /\bcarousel-control-(prev|next)\b/},
  {id: 'carousel-control-icon-bs5', re: /\bcarousel-control-(prev|next)-icon\b/},
  {id: 'carousel-dark', re: /\bcarousel-dark\b/},
  {id: 'text-bg-bootstrap', re: /\btext-bg-(primary|secondary|success|danger|warning|info|light|dark)\b/},
  {id: 'btn-outline-bs5', re: /\bbtn-outline-(primary|secondary|success|danger|warning|info|light|dark)\b/},
  {id: 'btn-primary-class', re: /\bbtn-primary\b/},
  {id: 'btn-secondary-class', re: /\bbtn-secondary\b/},
  {id: 'form-check-input', re: /\bform-check-input\b/},
  {id: 'popperjs', re: /@popperjs\/core/},
  {id: 'dropdown-menu', re: /\bdropdown-menu\b/},
  {id: 'fs-base', re: /\bfs-base\b/},
  {id: 'fs-bs5-numeric', re: /\bfs-[1-6]\b/},
];

const allowlist = [
  /Build\/scripts\/bootstrap6-audit\.mjs$/,
  /Build\/scripts\/bootstrap6-rename-sources\.mjs$/,
  /Classes\/Upgrade\//,
  /Classes\/Service\/Bootstrap6ContentMigrationService\.php$/,
  /Tests\/Unit\/Service\/Bootstrap6ContentMigrationServiceTest\.php$/,
  /Documentation\//,
  /CHANGELOG\.md$/,
  /Build\/Assets\/Scss\/Elements\/_(carousel|modal|links)\.scss$/,
];

function isAllowlisted(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return allowlist.some((re) => re.test(normalized));
}

const hits = [];

function walk(dir) {
  for (const ent of readdirSync(dir, {withFileTypes: true})) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === 'Public' || ent.name === 'vendor') {
        continue;
      }
      walk(p);
    } else if (scanExts.has(extname(ent.name)) || ent.name.endsWith('.fluid.html')) {
      const rel = relative(root, p);
      if (isAllowlisted(rel)) {
        continue;
      }
      const text = readFileSync(p, 'utf8');
      for (const rule of FORBIDDEN) {
        if (rule.re.test(text)) {
          hits.push({file: rel, rule: rule.id});
        }
      }
    }
  }
}

for (const dir of scanDirs) {
  walk(dir);
}

if (hits.length === 0) {
  console.log('Bootstrap 6 audit: OK (no forbidden v5 patterns in scanned sources).');
  process.exit(0);
}

console.error('Bootstrap 6 audit: forbidden Bootstrap 5 patterns found:\n');
for (const {file, rule} of hits) {
  console.error(`  [${rule}] ${file}`);
}
process.exit(1);
