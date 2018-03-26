import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import analyze from 'rollup-analyzer-plugin';
// import uglify from 'rollup-plugin-uglify';

import * as lodash from 'lodash';

export default {
  input: 'src/index.js',
  external: [
    'react',
    'react-dom',
    'react-redux',
    'redux-saga',
    'redux-saga/effects',
    ...Object.keys(lodash).map(name => `lodash/${name}`),
    'prop-types',
    'veritone-oauth-helpers',
    'veritone-functional-permissions',
    'redux-api-middleware-fixed'
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),

    babel({
      include: ['src/**/*.js']
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
      // modulesOnly: true
    }),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**', '../**']
    }),

    json(),
    // uglify({
    //   compress: { passes: 4, toplevel: true, keep_fnames: true },
    //   mangle: { keep_fnames: true },
    //   beautify: true
    // }),
    analyze({
      limit: 5,
      stdout: true
    })
  ]
};
