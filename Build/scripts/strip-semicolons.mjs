import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '../Assets/Scripts')

const skip = new Set([
  path.normalize('Assets/Scripts/backend.js'),
  path.normalize('Assets/Scripts/ckeditor.js')
])

function stripSemicolons(content) {
  return content
    .split('\n')
    .map((line) => line.replace(/;\s*$/, ''))
    .join('\n')
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
      continue
    }
    if (!entry.name.endsWith('.js')) continue

    const rel = path.relative(path.resolve(import.meta.dirname, '..'), full)
    if (skip.has(path.normalize(rel))) continue

    const tsPath = full.slice(0, -3) + '.ts'
    if (fs.existsSync(tsPath)) continue

    const content = stripSemicolons(fs.readFileSync(full, 'utf8'))
    fs.writeFileSync(tsPath, content)
    console.log('Wrote', path.relative(root, tsPath))
  }
}

walk(root)
