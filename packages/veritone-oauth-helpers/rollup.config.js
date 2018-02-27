import babel from 'rollup-plugin-babel';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/bundle-es.js',
        format: 'es',
        exports: 'named'
      },
      {
        file: 'dist/bundle-cjs.js',
        format: 'cjs'
      }
    ],
    plugins: [
      babel({
        include: ['src/**/*.js'],
        runtimeHelpers: true
      })
    ]
  }
];
