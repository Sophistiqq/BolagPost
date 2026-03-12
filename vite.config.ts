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
		noExternal: ['@libsql/client', '@libsql/isomorphic-ws']
	}
});
