const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const openBrowser = require('open');
const ip = require('ip');

const configer = require('./configer');
const projectConfig = require(path.resolve(process.cwd(), './abc.json'));

const DefaultProxyConfig = {};

process.env.NODE_ENV = 'development';

exports.run = (options) => {

  const { port, open } = options; 

  const webpackConfig = configer(projectConfig.type, options);

  const compiler = webpack(webpackConfig);

  const host = ip.address();
  
  const server = new webpackDevServer(compiler, {

    contentBase: webpackConfig.output.path,

    proxy: Object.assign({}, DefaultProxyConfig, projectConfig.proxy),

    hot: true,

    host: '0.0.0.0',

    stats: {
      colors: true
    },
  });

  server.listen(port, '0.0.0.0', function() {
    console.log(chalk.green(`Starting server on http://${host}:${port}`));
    if (open) {
      openBrowser(`http://${host}:${port}`);
    }
  });
};