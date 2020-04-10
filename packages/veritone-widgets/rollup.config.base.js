import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import url from 'rollup-plugin-url';
import analyze from 'rollup-analyzer-plugin';
import postcss from 'rollup-plugin-postcss';

import * as mui from '@material-ui/core';
import * as muiIcons from '@material-ui/icons';
import * as lodash from 'lodash';

import sass from './rollup-postcss-sass-loader';

export default {
  input: 'src/build-entry.js',
  external: [
    'react',
    'react-dom',
    'react-redux',
    'react-redux-saga',
    'recompose',
    'redux',
    'redux-api-middleware-fixed',
    'redux-saga',
    'redux-saga/effects',
    ...Object.keys(lodash).map(name => `lodash/${name}`),
    ...Object.keys(lodash).map(name => `lodash/fp/${name}`),
    ...Object.keys(muiIcons).map(name => `material-ui-icons/${name}`),
    ...Object.keys(mui).map(name => `@material-ui/core/${name}`),
    ...Object.keys(mui.colors).map(name => `material-ui/colors/${name}`),
    '@material-ui/styles',
    'prop-types',
    'veritone-react-common',
    'veritone-redux-common',
    'react-virtualized',
    'redux-thunk',
    'video-react',
    'shaka-player',
    'immutability-helper'
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),

    babel({
      include: ['src/**/*.js'],
      runtimeHelpers: true
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
      exclude: [
        'node_modules/process-es6/**'
      ],
      namedExports: {
        '../../node_modules/redux-form/node_modules/react-is/index.js': [
          'isElement',
          'isValidElementType'
        ],
        '../../node_modules/react-is/index.js': [
          'ForwardRef'
        ],
        '../../node_modules/jss/lib/index.js': [
          'createRule',
          'hasCSSTOMSupport'
        ]
      }
    }),

    postcss({
      modules: false,
      extract: true,
      loaders: [sass]
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
};
