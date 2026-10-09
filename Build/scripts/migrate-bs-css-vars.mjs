import fs from 'node:fs'
import path from 'node:path'

const pkgRoot = path.resolve(import.meta.dirname, '../..')

const skip = new Set([
  path.normalize('Build/Assets/Scss/Base/Bootstrap/_custom-variables.scss'),
  path.normalize('Build/Assets/Scss/Base/Bootstrap/_custom-variables-dark.scss'),
  path.normalize('Build/Assets/Scss/Base/Bootstrap/_mpc-bs6-token-bridge.scss'),
  path.normalize('Build/Assets/Scss/Base/Bootstrap/_mpc-bs6-compat.scss'),
])

const replacements = [
  ['--bs-color-', '--mpc-color-'],
  ['--bs-secondary-rgba', '--mpc-secondary-rgba'],
  ['--bs-body-font-family', '--body-font-family'],
  ['--bs-font-sans-serif', '--heading-font-family'],
  ['--bs-gray-dark', '--gray-800'],
  ['--bs-gray-900', '--gray-900'],
  ['--bs-gray-800', '--gray-800'],
  ['--bs-gray-700', '--gray-700'],
  ['--bs-gray-600', '--gray-600'],
  ['--bs-gray-500', '--gray-500'],
  ['--bs-gray-400', '--gray-400'],
  ['--bs-gray-300', '--gray-300'],
  ['--bs-gray-200', '--gray-200'],
  ['--bs-gray-100', '--gray-100'],
  ['--bs-red-700', '--danger-base'],
  ['--bs-green', '--primary-base'],
  ['--bs-secondary-bg', '--secondary-bg'],
  ['--bs-tertiary-bg', '--tertiary-bg'],
  ['--bs-border-radius-sm', '--radius-4'],
  ['--bs-border-radius', '--radius-5'],
  ['--bs-border-color', '--border-color'],
  ['--bs-box-shadow', '--box-shadow'],
  ['--bs-body-bg', '--bg-body'],
  ['--bs-body-color', '--fg-body'],
  ['--bs-secondary-color', '--fg-2'],
  ['--bs-quaternary', '--quaternary-base'],
  ['--bs-tertiary', '--tertiary-base'],
  ['--bs-secondary', '--secondary-base'],
  ['--bs-primary', '--primary-base'],
  ['--bs-danger', '--danger-base'],
  ['--bs-white', '--white'],
  ['--bs-black', '--black'],
  ['--bs-orange', '--mpc-accent-orange'],
  ['--bs-yellow', '--mpc-accent-yellow'],
  ['--bs-dark', '--gray-900'],
  ['var(--#{$prefix}font-sans-serif)', 'var(--heading-font-family)'],
  ['var(--#{$prefix}body-font-family)', 'var(--body-font-family)'],
]

const exts = new Set(['.scss', '.vue', '.ts', '.html', '.php'])

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === 'vendor' || ent.name === '.Build') continue
      walk(full, files)
    } else if (exts.has(path.extname(ent.name))) {
      files.push(full)
    }
  }
  return files
}

const files = walk(pkgRoot)

for (const file of files) {
  const rel = path.relative(pkgRoot, file).replace(/\\/g, '/')
  if (skip.has(rel)) continue
  if (rel.includes('Resources/Public/')) continue

  let content = fs.readFileSync(file, 'utf8')
  let changed = false
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to)
      changed = true
    }
  }
  if (changed) {
    fs.writeFileSync(file, content)
    console.log('updated', rel)
  }
}
