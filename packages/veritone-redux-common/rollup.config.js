import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import analyze from 'rollup-analyzer-plugin';
// import uglify from 'rollup-plugin-uglify';

import PropTypes from 'prop-types';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/bundle-es.js',
        format: 'es',
        exports: 'named'
      }
    ],
    external: ['react', 'react-dom', 'react-redux', 'redux-saga', 'redux-saga/effects', 'lodash'],
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
        include: ['../../node_modules/**', 'node_modules/**', '../**'],
        namedExports: {
          'prop-types': Object.keys(PropTypes)
        }
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
  }
];
