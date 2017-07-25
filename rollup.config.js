import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
	entry: './index.js',
	format: 'cjs',
	plugins: [
		babel({
			exclude: 'node_modules/**'
		}),
		resolve({ jsnext: true }),
		commonjs(),
		json()
	],
	dest: 'dist/bundle.js'
};
