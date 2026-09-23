import {defineConfig} from 'vite';
import concat from '@vituum/vite-plugin-concat';

export default defineConfig({
	base: './',
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					phaser: ['phaser']
				}
			}
		},
	},
	server: {
		port: 8080
	},
	plugins: [
		concat({
			files: { 'concept-jeopardy.js': ['src/**'] },
			input: ['concept-jeopardy.js']
		})
	]
});
