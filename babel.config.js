const esm = !!process.env.ESM

export default {
  presets: [
    ['@babel/preset-env', {
      bugfixes: true,
      loose: true,
      modules: esm ? false : undefined,
      targets: [
        // do not transform arrow functions
        'chrome 47, edge 13, firefox 45, opera 34',
      ],
    }],
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', {loose: true}],
  ],
}
