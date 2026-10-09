import {defineConfig} from 'vite'
import {resolve} from 'path'
import {fileURLToPath} from 'url'
import vue from '@vitejs/plugin-vue'
import {tsResolvePlugin} from './scripts/ts-resolve-vite-plugin.mjs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Define all entry points
// Note: Swiper is now integrated into Vue component (vue.js) - no separate entry point needed
const entryPoints = {
  bootstrap: resolve(__dirname, 'Assets/Scripts/bootstrap.ts'),
  screen: resolve(__dirname, 'Assets/Scripts/screen.ts'),
  navigationPrimary: resolve(__dirname, 'Assets/Scripts/navigationPrimary.ts'),
  navigationSecondary: resolve(__dirname, 'Assets/Scripts/navigationSecondary.ts'),
  navigationTertiary: resolve(__dirname, 'Assets/Scripts/navigationTertiary.ts'),
  ckeditor: resolve(__dirname, 'Assets/Scripts/ckeditor.js'),
  backend: resolve(__dirname, 'Assets/Scripts/backend.js'),
  print: resolve(__dirname, 'Assets/Scripts/print.ts'),
  vue: resolve(__dirname, 'Assets/Scripts/vue.ts')
}

// Vendor splitting groups. Keys become the chunk file name; values are the
// node_modules subpaths that should land in that chunk. Splitting yields
// long-lived cacheable vendor bundles separate from our own application code,
// which is what dominates churn between releases.
const vendorChunks = {
  'vendor-vue': ['/node_modules/vue/', '/node_modules/@vue/'],
  'vendor-swiper': ['/node_modules/swiper/'],
  'vendor-bootstrap': ['/node_modules/bootstrap/'],
  'vendor-floating-ui': ['/node_modules/@floating-ui/'],
  'vendor-jarallax': ['/node_modules/jarallax/']
}

function vendorChunkFor(id) {
  const normalized = id.replace(/\\/g, '/')
  for (const [chunk, matchers] of Object.entries(vendorChunks)) {
    if (matchers.some((m) => normalized.includes(m))) {
      return chunk
    }
  }
  return undefined
}

export default defineConfig(async ({mode}) => {
  const isDev = mode === 'development'

  const plugins = [tsResolvePlugin(), vue()]

  return {
    root: resolve(__dirname),
    base: './',
    publicDir: resolve(__dirname, 'Assets/Static'),

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          loadPaths: [resolve(__dirname, 'Assets/Scss')],
          silenceDeprecations: [],
          sourcemap: isDev ? 'inline' : false // SCSS sourcemaps
        }
      },
      devSourcemap: true // Dev server CSS sourcemaps
    },

    plugins,

    build: {
      outDir: resolve(__dirname, '../Resources/Public'),
      emptyOutDir: true,
      sourcemap: isDev, // Both JS and CSS sourcemaps in dev
      minify: !isDev, // Don't minify in dev mode for readable output
      manifest: false,
      assetsInlineLimit: 0, // Don't inline any assets, always emit files

      rollupOptions: {
        input: entryPoints,
        output: {
          entryFileNames: 'JavaScripts/[name].js',
          chunkFileNames: 'JavaScripts/[name]-[hash].js',
          manualChunks(id) {
            return vendorChunkFor(id)
          },
          assetFileNames: (assetInfo) => {
            const name = assetInfo.names?.[0] ?? assetInfo.name ?? ''
            if (name.endsWith('.css')) {
              return 'StyleSheets/[name][extname]'
            }
            if (/\.(woff2?|ttf|eot)$/.test(name)) {
              return 'Fonts/[name][extname]'
            }
            if (/\.(png|jpe?g|gif|webp|avif)$/.test(name)) {
              return 'Images/[name][extname]'
            }
            if (/\.svg$/.test(name)) {
              return 'Icons/[name][extname]'
            }
            return '[name][extname]'
          }
        }
      },

      // Adjust the chunk size warning limit if needed
      chunkSizeWarningLimit: 1000
    },

    server: {
      // Not used with DDEV - using watch mode instead
      port: 3000,
      strictPort: false,
      watch: {
        // Use polling for better file watching in Docker environments
        usePolling: true,
        interval: 100
      }
    },

    // Resolve aliases (optional, but helpful)
    resolve: {
      alias: {
        '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
        '@assets': resolve(__dirname, 'Assets')
      }
    }
  }
})

