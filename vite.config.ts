import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			// Mock ws for client-side to prevent bundling issues
			ws: './src/lib/server/ws-mock.ts'
		}
	},
	ssr: {
	        noExternal: ['@vercel/blob', 'undici', 'async-retry', 'is-buffer', 'is-node-process', 'throttleit']
	}});
