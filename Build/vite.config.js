import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import stylelint from 'vite-plugin-stylelint';
import eslint from '@nabla/vite-plugin-eslint';
import vue from '@vitejs/plugin-vue';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Define all entry points
const entryPoints = {
	bootstrap: resolve(__dirname, 'Assets/Scripts/bootstrap.js'),
	screen: resolve(__dirname, 'Assets/Scripts/screen.js'),
	vidply: resolve(__dirname, 'Assets/Scripts/vidply.js'),
	swiper: resolve(__dirname, 'Assets/Scripts/swiper.js'),
	navigationPrimary: resolve(__dirname, 'Assets/Scripts/navigationPrimary.js'),
	navigationSecondary: resolve(__dirname, 'Assets/Scripts/navigationSecondary.js'),
	navigationTertiary: resolve(__dirname, 'Assets/Scripts/navigationTertiary.js'),
	ckeditor: resolve(__dirname, 'Assets/Scripts/ckeditor.js'),
	backend: resolve(__dirname, 'Assets/Scripts/backend.js'),
	print: resolve(__dirname, 'Assets/Scripts/print.js'),
	vue: resolve(__dirname, 'Assets/Scripts/vue.js')
};

export default defineConfig(({ mode }) => {
	const isDev = mode === 'development';

	return {
		root: resolve(__dirname),
		base: './',
		publicDir: resolve(__dirname, 'Assets/Static'),
		
		css: {
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler',
					silenceDeprecations: ['color-functions', 'global-builtin', 'import'],
				}
			},
			devSourcemap: isDev
		},

	plugins: [
		// Vue 3 support
		vue(),
		
		// ESLint integration (only in dev for better performance)
		isDev && eslint({
			eslintOptions: {
				fix: true,
				cache: true
			}
		}),
		
		// Stylelint integration
		stylelint({
			fix: true,
			include: ['Assets/Scss/**/*.{css,scss,sass}'],
			emitErrorAsWarning: isDev
		})
	].filter(Boolean),

		build: {
			outDir: resolve(__dirname, '../Resources/Public'),
			emptyOutDir: true,
			sourcemap: isDev ? true : false,
			manifest: false,
			assetsInlineLimit: 0, // Don't inline any assets, always emit files
			
			rollupOptions: {
				input: entryPoints,
				output: {
					entryFileNames: 'JavaScripts/[name].js',
					chunkFileNames: 'JavaScripts/[name].js',
					assetFileNames: (assetInfo) => {
						// CSS files go to StyleSheets/
						if (assetInfo.name.endsWith('.css')) {
							return 'StyleSheets/[name][extname]';
						}
						// Fonts
						if (/\.(woff2?|ttf|eot)$/.test(assetInfo.name)) {
							return 'Fonts/[name][extname]';
						}
						// Images
						if (/\.(png|jpe?g|gif|webp|avif)$/.test(assetInfo.name)) {
							return 'Images/[name][extname]';
						}
						// SVG Icons
						if (/\.svg$/.test(assetInfo.name)) {
							return 'Icons/[name][extname]';
						}
						// Default
						return '[name][extname]';
					}
				}
			},

			// Adjust chunk size warning limit if needed
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

