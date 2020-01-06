import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import pkg from './package.json';

const extensions = [
  '.js'
];

export default {
  input: './src/index.js',
  external: [],
  plugins: [
    json({
      include: ['schemas/**', 'node_modules/ajv/**/*', '../../node_modules/ajv/**/*'],
      preferConst: true,
      indent: '  ',
      compact: true,
      namedExports: true
    }),
    resolve({ extensions }),
    commonjs(),
    babel({ extensions, include: ['src/**/*'], runtimeHelpers: true }),
  ],
  output: [{
    file: pkg.main,
    format: 'cjs',
  }, {
    file: pkg.module,
    format: 'es',
  }]
};
