import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import babili from 'rollup-plugin-babili';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';

export default {
	moduleName: 'veritoneApi',
  entry: './index.js',
  format: process.env.BUILD_ENV === 'browser' ? 'umd' : 'cjs',
  sourceMap: true,
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({ jsnext: true }),
    replace({
      exclude: 'node_modules/**',
      __BROWSER__: process.env.BUILD_ENV === 'browser',
      __NODEJS__: process.env.BUILD_ENV === 'node'
    }),
    commonjs(),
    json(),
    babili({
      comments: false,
      sourceMap: true
    })
  ],
  dest:
    process.env.BUILD_ENV === 'browser'
      ? 'dist/bundle-browser.js'
      : 'dist/bundle-node.js'
};
