const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
  transpileDependencies: ['vuetify'],
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@assets', resolve('src/assets'))
      .set('@commons', resolve('src/commons'))
      .set('@plugins', resolve('src/plugins'))
      .set('@graph', resolve('src/graph'))
      .set('@components', resolve('src/components'))
      .set('@theme', resolve('theme'));
  }
};
