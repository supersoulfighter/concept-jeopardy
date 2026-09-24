import {defineConfig} from 'vite';
import concat from '@vituum/vite-plugin-concat';

export default defineConfig({
	base: './',
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
