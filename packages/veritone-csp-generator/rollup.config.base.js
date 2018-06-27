import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import analyze from 'rollup-analyzer-plugin';

import * as lodash from 'lodash';

export default {
  input: 'src/index.js',
  external: [
    ...Object.keys(lodash).map(name => `lodash/${name}`),
    ...Object.keys(lodash).map(name => `lodash/fp/${name}`)
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),

    babel({
      include: ['**/*.js']
    }),

    resolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      preferBuiltins: false,
      customResolveOptions: {
        moduleDirectory: ['../../node_modules', 'node_modules']
      }
    }),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**', '../**']
    }),

    json(),

    analyze({
      limit: 5,
      stdout: true
    })
  ]
};
