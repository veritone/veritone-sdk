import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import url from "rollup-plugin-url"
import analyze from 'rollup-analyzer-plugin';
import postcss from 'rollup-plugin-postcss';
// import uglify from 'rollup-plugin-uglify';

import PropTypes from 'prop-types';
import * as rfmui from 'redux-form-material-ui';
import * as mui from 'material-ui';

import sass from './rollup-postcss-sass-loader';

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
    external: [
      'react',
      'react-dom',
      'react-redux',
      'redux-saga',
      'redux-saga/effects',
      'lodash',
      ...Object.keys(mui).map(name => `material-ui/${name}`),
      'material-ui/styles',
      'material-ui/Form',
      'material-ui/Progress'
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
        include: ['../../node_modules/**', 'node_modules/**', '../**'],
        namedExports: {
          'prop-types': Object.keys(PropTypes),
          'react-dnd': ['DropTarget', 'DragDropContext'],
          'redux-form-material-ui/es': Object.keys(rfmui)
        }
      }),

      postcss({
        modules: true,
        loaders: [sass],
        extract: true
      }),

      json(),

      url(),

      // uglify({
      //   compress: { passes: 4, toplevel: true },
      // }),

      analyze({
        limit: 5,
        stdout: true
      })
    ]
  }
];
