import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = dirname

const DEBUG = Boolean(process.env.DEBUG)

const tsResolve = () => {
  const cache = new Map<string, string | null>()

  return {
    name: 'ts-resolve',
    enforce: 'pre' as const,
    resolveId(source: string, importer?: string) {
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

export default defineConfig({
  root,
  plugins: [tsResolve()],
  test: {
    include: ['Tests/**/*.spec.ts'],
    passWithNoTests: false,
    browser: {
      enabled: true,
      provider: playwright(),
      headless: !DEBUG,
      screenshotFailures: false,
      instances: [
        { browser: 'chromium' }
      ]
    }
  }
})
