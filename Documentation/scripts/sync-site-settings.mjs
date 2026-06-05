#!/usr/bin/env node
// Regenerates Site Settings tables in Documentation/Configuration.md
// from Configuration/Sets/<set>/settings.definitions.yaml and settings.yaml.
//
// Usage (from libs/mp-core):
//   node Documentation/scripts/sync-site-settings.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MP_CORE_ROOT = join(__dirname, '../..');
const CONFIG_MD = join(MP_CORE_ROOT, 'Documentation/Configuration.md');
const SETS_DIR = join(MP_CORE_ROOT, 'Configuration/Sets');

const SETS = [
  {
    id: 'mp-core',
    title: 'Core (shared — `mpc/mp-core` / registered via `mpc/mp-core-base`)',
    intro: `Site Settings definitions and defaults live in \`Configuration/Sets/mp-core/settings.definitions.yaml\` and \`settings.yaml\`. The base set only references these files.

Source: \`Configuration/Sets/mp-core/\``,
  },
  {
    id: 'mp-core-container',
    title: 'Container (`mpc/mp-core-container`)',
    intro: 'Source: `Configuration/Sets/mp-core-container/`',
  },
  {
    id: 'mp-core-news',
    title: 'News (`mpc/mp-core-news`)',
    intro: 'Source: `Configuration/Sets/mp-core-news/`',
  },
  {
    id: 'mp-core-form',
    title: 'Form (`mpc/mp-core-form`)',
    intro: 'Source: `Configuration/Sets/mp-core-form/`',
  },
  {
    id: 'mp-core-seo',
    title: 'SEO (`mpc/mp-core-seo`)',
    intro: 'Source: `Configuration/Sets/mp-core-seo/`',
  },
];

/** @param {string} raw */
function parseDefinitions(raw) {
  // Normalize CRLF/CR so the line-anchored regexes below match regardless of
  // the source file's line endings (mp-core ships CRLF, feature sets LF).
  raw = raw.replace(/\r\n?/g, '\n');
  /** @type {Array<{key: string, type: string, default: string, category: string}>} */
  const items = [];
  const blocks = raw.split(/\n  ([A-Za-z0-9_.]+):\n/g);
  // blocks[0] is preamble; then key, body, key, body, ...
  for (let i = 1; i < blocks.length; i += 2) {
    const key = blocks[i];
    const body = blocks[i + 1] ?? '';
    const typeMatch = body.match(/\n    type: (\w+)/);
    const defaultMatch = body.match(/\n    default: (.+)/);
    const categoryMatch = body.match(/\n    category: (\w+)/);
    if (!typeMatch) {
      continue;
    }
    let defaultVal = defaultMatch ? defaultMatch[1].trim() : '';
    if (defaultVal === "''" || defaultVal === '""') {
      defaultVal = '';
    } else if (
      (defaultVal.startsWith("'") && defaultVal.endsWith("'")) ||
      (defaultVal.startsWith('"') && defaultVal.endsWith('"'))
    ) {
      defaultVal = defaultVal.slice(1, -1);
    }
    items.push({
      key,
      type: typeMatch[1],
      default: defaultVal,
      category: categoryMatch?.[1] ?? '',
    });
  }
  return items;
}

/** @param {string} raw */
function parseSettingsYaml(raw) {
  raw = raw.replace(/\r\n?/g, '\n');
  /** @type {Record<string, string>} */
  const map = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const m = trimmed.match(/^([A-Za-z0-9_.]+):\s*(.*)$/);
    if (!m) {
      continue;
    }
    let val = m[2].trim();
    if (
      (val.startsWith("'") && val.endsWith("'")) ||
      (val.startsWith('"') && val.endsWith('"'))
    ) {
      val = val.slice(1, -1);
    }
    map[m[1]] = val;
  }
  return map;
}

/** @param {string} val */
function formatDefault(val) {
  if (val === '') {
    return '(empty)';
  }
  const escaped = val.replace(/\|/g, '\\|');
  if (escaped.includes('`')) {
    return escaped;
  }
  return `\`${escaped}\``;
}

/** @param {Array<{key: string, type: string, default: string}>} items */
/** @param {Record<string, string>} shipped */
function renderTable(items, shipped) {
  const hasShipped = items.some((item) => {
    const s = shipped[item.key];
    return s !== undefined && s !== item.default;
  });

  const header = hasShipped
    ? '| Key | Type | Schema default | Shipped default |\n|-----|------|----------------|-----------------|'
    : '| Key | Type | Default |\n|-----|------|---------|';

  const rows = items.map((item) => {
    if (hasShipped) {
      const s = shipped[item.key];
      const shippedCol =
        s !== undefined && s !== item.default ? formatDefault(s) : '—';
      return `| \`${item.key}\` | ${item.type} | ${formatDefault(item.default)} | ${shippedCol} |`;
    }
    return `| \`${item.key}\` | ${item.type} | ${formatDefault(item.default)} |`;
  });

  return `${header}\n${rows.join('\n')}\n`;
}

/** Group mp-core items by category for subsections */
const CORE_CATEGORY_LABELS = {
  MPCore: 'PIDs',
  MPCoreFluidRoots: 'Fluid root paths',
  MPCoreContent: 'Content',
  MPCoreConfig: 'Configuration',
  MPCorePerformance: 'Performance',
  MPCoreDesign: 'Design',
  MPCoreNavigation: 'Navigation',
  MPCoreMeta: 'Meta',
  MPCoreTemplates: 'Templates & paths',
};

/** @param {{key: string, category: string}} item */
function coreGroupKey(item) {
  if (item.category === 'MPCore') {
    if (item.key.startsWith('PIDs.')) {
      return 'MPCore';
    }
    if (item.key.startsWith('templates.')) {
      return 'MPCoreFluidRoots';
    }
  }
  return item.category;
}

function renderCoreSet(setId, title, intro) {
  const defPath = join(SETS_DIR, setId, 'settings.definitions.yaml');
  const shipPath = join(SETS_DIR, setId, 'settings.yaml');
  const items = parseDefinitions(readFileSync(defPath, 'utf8'));
  const shipped = parseSettingsYaml(readFileSync(shipPath, 'utf8'));

  let out = `### ${title}\n\n${intro}\n\n`;
  out +=
    '> **Schema default** — \`default\` in `settings.definitions.yaml` (Site Settings UI). **Shipped default** — value from `settings.yaml` when it overrides the schema (column `—` = same as schema).\n\n';

  const byCategory = new Map();
  for (const item of items) {
    const cat = coreGroupKey(item);
    if (!byCategory.has(cat)) {
      byCategory.set(cat, []);
    }
    byCategory.get(cat).push(item);
  }

  const order = [
    'MPCore',
    'MPCoreFluidRoots',
    'MPCoreContent',
    'MPCoreConfig',
    'MPCorePerformance',
    'MPCoreDesign',
    'MPCoreNavigation',
    'MPCoreMeta',
    'MPCoreTemplates',
  ];

  for (const cat of order) {
    const catItems = byCategory.get(cat);
    if (!catItems?.length) {
      continue;
    }
    const label = CORE_CATEGORY_LABELS[cat] ?? cat;
    out += `#### ${label}\n\n`;
    out += renderTable(catItems, shipped);
    out += '\n';
  }

  return out;
}

function renderFeatureSet(setId, title, intro) {
  const defPath = join(SETS_DIR, setId, 'settings.definitions.yaml');
  const shipPath = join(SETS_DIR, setId, 'settings.yaml');
  const items = parseDefinitions(readFileSync(defPath, 'utf8'));
  const shipped = parseSettingsYaml(readFileSync(shipPath, 'utf8'));

  let out = `### ${title}\n\n${intro}\n\n`;
  out += renderTable(items, shipped);
  out += '\n';
  return out;
}

function buildSiteSettingsSection() {
  const generatedAt = new Date().toISOString().slice(0, 10);
  let section = `## Site Settings

<!-- BEGIN SITE-SETTINGS-AUTO (${generatedAt}) — generated by Documentation/scripts/sync-site-settings.mjs; do not edit tables by hand -->

Editable via **Site Management → Sites → Settings** or \`config/sites/[site]/settings.yaml\`.

Regenerate after changing \`settings.definitions.yaml\` / \`settings.yaml\`:

\`\`\`bash
node Documentation/scripts/sync-site-settings.mjs
\`\`\`

`;

  for (const set of SETS) {
    if (set.id === 'mp-core') {
      section += renderCoreSet(set.id, set.title, set.intro);
    } else {
      section += renderFeatureSet(set.id, set.title, set.intro);
    }
  }

  section += `<!-- END SITE-SETTINGS-AUTO -->

`;
  return section;
}

const configMd = readFileSync(CONFIG_MD, 'utf8');
const sectionStart = configMd.indexOf('## Site Settings');
const nextSection = configMd.indexOf('### Using Settings in TypoScript', sectionStart);

if (sectionStart === -1 || nextSection === -1) {
  console.error(
    'Could not find "## Site Settings" or "### Using Settings in TypoScript" in Configuration.md',
  );
  process.exit(1);
}

const newSection = buildSiteSettingsSection();
const updated =
  configMd.slice(0, sectionStart) + newSection + configMd.slice(nextSection);

writeFileSync(CONFIG_MD, updated);
console.log('Updated Documentation/Configuration.md Site Settings tables.');
