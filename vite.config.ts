import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			// Mock ws to prevent bundling issues on Vercel
			ws: '/src/lib/server/ws-mock.ts'
		}
	},
	ssr: {
		noExternal: ['@libsql/client']
	}
});
