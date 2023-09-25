const path = require('path');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, '.webpack'),
            path.resolve(__dirname, '.serverless'),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalFileCaching: true,
        },
      },
    ],
  },
};
