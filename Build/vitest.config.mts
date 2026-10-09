import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
import { tsResolvePlugin } from './scripts/ts-resolve-vite-plugin.mjs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = dirname

const DEBUG = Boolean(process.env.DEBUG)

export default defineConfig({
  root,
  plugins: [tsResolvePlugin()],
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
