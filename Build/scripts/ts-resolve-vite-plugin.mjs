import fs from 'node:fs'
import path from 'node:path'

/**
 * Maps ESM-style `.js` import specifiers to sibling `.ts` sources (Bootstrap upstream pattern).
 */
export function tsResolvePlugin() {
  const cache = new Map()

  return {
    name: 'ts-resolve',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer || !source.startsWith('.') || !source.endsWith('.js')) {
        return null
      }

      const tsPath = path.resolve(path.dirname(importer), `${source.slice(0, -3)}.ts`)

      if (!cache.has(tsPath)) {
        cache.set(tsPath, fs.existsSync(tsPath) ? tsPath : null)
      }

      return cache.get(tsPath)
    }
  }
}
