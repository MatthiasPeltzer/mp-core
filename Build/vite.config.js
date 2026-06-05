import {defineConfig} from 'vite';
import {resolve} from 'path';
import {fileURLToPath} from 'url';
import vue from '@vitejs/plugin-vue';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Define all entry points
// Note: Swiper is now integrated into Vue component (vue.js) - no separate entry point needed
const entryPoints = {
  bootstrap: resolve(__dirname, 'Assets/Scripts/bootstrap.js'),
  screen: resolve(__dirname, 'Assets/Scripts/screen.js'),
  navigationPrimary: resolve(__dirname, 'Assets/Scripts/navigationPrimary.js'),
  navigationSecondary: resolve(__dirname, 'Assets/Scripts/navigationSecondary.js'),
  navigationTertiary: resolve(__dirname, 'Assets/Scripts/navigationTertiary.js'),
  ckeditor: resolve(__dirname, 'Assets/Scripts/ckeditor.js'),
  backend: resolve(__dirname, 'Assets/Scripts/backend.js'),
  print: resolve(__dirname, 'Assets/Scripts/print.js'),
  vue: resolve(__dirname, 'Assets/Scripts/vue.js')
};

// Vendor splitting groups. Keys become the chunk file name; values are the
// node_modules subpaths that should land in that chunk. Splitting yields
// long-lived cacheable vendor bundles separate from our own application code,
// which is what dominates churn between releases.
const vendorChunks = {
  'vendor-vue': ['/node_modules/vue/', '/node_modules/@vue/'],
  'vendor-swiper': ['/node_modules/swiper/'],
  'vendor-bootstrap': ['/node_modules/bootstrap/'],
  'vendor-popper': ['/node_modules/@popperjs/'],
  'vendor-jarallax': ['/node_modules/jarallax/']
};

function vendorChunkFor(id) {
  const normalized = id.replace(/\\/g, '/');
  for (const [chunk, matchers] of Object.entries(vendorChunks)) {
    if (matchers.some((m) => normalized.includes(m))) {
      return chunk;
    }
  }
  return undefined;
}

export default defineConfig(async ({mode}) => {
  const isDev = mode === 'development';
  const analyze = process.env.ANALYZE === '1';

  const plugins = [vue()];

  if (analyze) {
    // Loaded dynamically so the package is only required when explicitly
    // running `npm run build:analyze`. Keeps the default install path light.
    const {visualizer} = await import('rollup-plugin-visualizer');
    plugins.push(
      visualizer({
        filename: resolve(__dirname, 'reports/bundle-stats.html'),
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
        sourcemap: false,
        open: false
      })
    );
  }

  return {
    root: resolve(__dirname),
    base: './',
    publicDir: resolve(__dirname, 'Assets/Static'),

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['if-function', 'color-functions', 'global-builtin', 'import'],
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
            return vendorChunkFor(id);
          },
          assetFileNames: (assetInfo) => {
            const name = assetInfo.names?.[0] ?? assetInfo.name ?? '';
            if (name.endsWith('.css')) {
              return 'StyleSheets/[name][extname]';
            }
            if (/\.(woff2?|ttf|eot)$/.test(name)) {
              return 'Fonts/[name][extname]';
            }
            if (/\.(png|jpe?g|gif|webp|avif)$/.test(name)) {
              return 'Images/[name][extname]';
            }
            if (/\.svg$/.test(name)) {
              return 'Icons/[name][extname]';
            }
            return '[name][extname]';
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
        '@assets': resolve(__dirname, 'Assets'),
        '@components': resolve(__dirname, 'Assets/Scripts/components')
      }
    }
  };
});

