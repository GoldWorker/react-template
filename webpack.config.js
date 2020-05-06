const common = require('./webpack.common');
const devConfig = require('./webpack.dev');
const proConfig = require('./webpack.prod');
const qaConfig = require('./webpack.qa');
//webpack性能分析工具
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin({
    outputFormat: 'human'
});

module.exports = function(env, arg) {
    console.log('环境', env, '打包模式', arg.mode);
    if (arg.mode == 'development') {
        return Object.assign({}, common, devConfig, );
    }
    switch (env) {
        case 'qa':
            return Object.assign({}, common, qaConfig);
        case 'pro':
            return smp.wrap(Object.assign({}, common, proConfig));
    }
};
