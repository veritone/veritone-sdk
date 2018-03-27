import baseConfig from './rollup.config.base';

export default Object.assign({}, baseConfig, {
  output: [
    {
      file: 'dist/bundle-es.js',
      format: 'es',
      exports: 'named'
    }
  ]
});
