import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import babili from 'rollup-plugin-babili';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
	entry: './index.js',
	format: 'cjs',
	sourceMap: true,
	plugins: [
		babel({
			exclude: 'node_modules/**'
		}),
		resolve({ jsnext: true }),
		commonjs(),
		json(),
		babili({
			comments: false,
			sourceMap: true
		})
	],
	dest: 'dist/bundle.js'
};
