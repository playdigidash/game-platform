const nrwlConfig = require('@nrwl/react/plugins/webpack');
const path = require('path');

module.exports = (config, context) => {
  // First get the default config from NX
  nrwlConfig(config);

  // Add support for WebAssembly
  config.experiments = {
    ...config.experiments,
    asyncWebAssembly: true,
  };

  // Add WASM loader
  config.module.rules.push({
    test: /\.wasm$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'wasm/'
        }
      }
    ],
    type: 'javascript/auto'
  });

  // Add TSX/JSX handling for external libraries
  config.module.rules.push({
    test: /\.(ts|tsx|js|jsx)$/,
    include: [
      path.resolve(__dirname, '../../libs'),
    ],
    use: [
      {
        loader: require.resolve('@nrwl/web/src/utils/web-babel-loader.js'),
        options: {
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript',
          ],
        },
      },
    ],
  });

  // Resolve .wasm extensions
  config.resolve.extensions.push('.wasm');

  // Add fallback for node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    crypto: false
  };

  // Return the modified config
  return config;
}; 