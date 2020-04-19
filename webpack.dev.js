const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ENV_CONF = require('./environment/dev.env.ts');

module.exports = {
    devtool: 'source-map',
    //出口配置
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].js'
        // publicPath: '/public'
    },
    watch: true,
    watchOptions: {
        ignored: /node_modules/, //忽略不用监听变更的目录
        aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包
        poll: 5 //每秒询问的文件变更的次数
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.scss$/,
            // exclude: /node_modules/,
            use: ['css-hot-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            include: [
                path.join(__dirname, 'src/'),
                path.join(__dirname, 'node_modules/slucky/lib/sass/')
            ]
        }, {
            test: /.jsx|.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.tsx|.ts$/,
            use: ['babel-loader', 'ts-loader'],
            exclude: /node_modules/
        }, {
            test: /\.svg$/,
            include: [path.resolve(__dirname, 'src/icons')],
            use: [{
                loader: 'svg-sprite-loader',
                options: {
                    symbolId: 'icon-[name]'
                }
            },
            'svg-fill-loader', {
                loader: 'svgo-loader',
                options: {
                    plugins: [{
                        removeTitle: true
                    }, {
                        convertColors: {
                            shorthex: false
                        }
                    }, {
                        convertPathData: false
                    }]
                }
            }
            ]
        }, {
            test: /\.(jpg|png|gif|jpeg)$/,
            use: [{
                loader: 'url-loader'
            }],
            exclude: /node_modules/
        }, {
            test: /\.(eot|ttf|woff)$/,
            use: 'file-loader',
            exclude: /node_modules/
        }, {
            test: /\.(html|htm)$/,
            use: 'html-withimg-loader',
            exclude: /node_modules/
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            // 源码中所有 process.env 都会被替换为'./environment/dev.env'这个module export出来的东西
            'process.env': JSON.stringify(ENV_CONF)
        }),
        new MiniCssExtractPlugin({
            filename: 'slucky.css'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'), //模板
            filename: 'index.html',
            // chunks:['index'],
            hash: true, //防止缓存
            title: 'slucky',
            minify: false
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin() //用户名替代id,更新组件时在控制台输出组件的路径而不是数字ID，用在开发模式
        // new webpack.HashedModuleIdsPlugin(), // 用在生产模式 new
        // CleanWebpackPlugin(['dist','build'],{     verbose:false,
        // exclude:['img']//不删除img静态资源 }),
    ],
    //开发服务器
    devServer: { //配置此静态文件服务器，可以用来预览打包后项目
        contentBase: path.resolve(__dirname, 'dist'), //开发服务运行时的文件根目录
        host: 'localhost', //主机地址
        // public: 'www.brandf.cn',
        port: 8080, //端口号
        // compress: true,//开发服务器是否启动gzip等压缩
        historyApiFallback: true,
        disableHostCheck: true,
        hot: true,
        inline: true,
        overlay: { //当有编译错误或者警告的时候显示一个全屏overlay
            errors: true,
            warnings: true
        }
        // proxy: {
        //     '/api': {
        //         target: 'https://www.brandf.cn',
        //         pathRewrite: {
        //             '^/api': ''
        //         },
        //         ignorePath: true,
        //         changeOrigin: true, 
        //         secure: false
        //     }
        // }
    }
};
