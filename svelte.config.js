import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		paths: {
			base: process.env.BASE_PATH || ''
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		prerender: {
			handleHttpError: ({ path }) => {
				// Allow missing images during build — they'll be added separately
				if (path.startsWith('/images/')) return;
				throw new Error(`404: ${path}`);
			}
		}
	}
};

export default config;
