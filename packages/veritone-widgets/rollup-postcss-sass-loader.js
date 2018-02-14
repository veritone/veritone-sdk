// based on https://github.com/egoist/rollup-plugin-postcss/blob/master/src/sass-loader.js
// but modified to use a normal import for node-sass, to work within
// a yarn workspace environment.

import pify from 'pify';
import sass from 'node-sass';

export default {
  name: 'sass',
  test: /\.s[ac]ss$/,
  async process({ code }) {
    const res = await pify(sass.render.bind(sass))(Object.assign({}, this.options, {
      file: this.id,
      data: code,
      indentedSyntax: /\.sass$/.test(this.id),
      sourceMap: this.sourceMap
    }));

    return {
      code: res.css.toString(),
      map: res.map && res.map.toString()
    };
  }
};
