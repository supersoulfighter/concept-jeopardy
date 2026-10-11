import {defineConfig} from 'vite';
import concat from '@vituum/vite-plugin-concat';

export default defineConfig({
	base: './',
	server: {
		port: 8080
	},
	plugins: [
		concat({
			files: { 'concept-jeopardy.js': ['src/**/*.js'] },
			input: ['concept-jeopardy.js']
		})
	]
});
