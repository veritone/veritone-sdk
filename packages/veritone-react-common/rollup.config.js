import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import url from "rollup-plugin-url"
import analyze from 'rollup-analyzer-plugin';
import postcss from 'rollup-plugin-postcss';
import { snakeCase } from 'lodash';

import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import * as datefns from 'date-fns';
import * as lodash from 'lodash';
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
      'material-ui/styles',
      'material-ui/Form',
      'material-ui/Progress',
      'redux-form-material-ui',
      'react-dnd',
      'react-dnd-html5-backend',
      'react-infinite-calendar',
      'redux',
      'redux-form',
      'pluralize',
      'mime-types',
      'classnames',
      ...Object.keys(mui).map(name => `material-ui/${name}`),
      ...Object.keys(datefns).map(name => `date-fns/${snakeCase(name)}`),
      ...Object.keys(lodash).map(name => `lodash/${name}`),
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
          'prop-types': Object.keys(PropTypes)
        }
      }),

      postcss({
        modules: true,
        loaders: [sass]
        // extract: 'dist/styles.css'
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
