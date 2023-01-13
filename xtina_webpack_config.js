const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/*
【 loaders 】 tell webpack how to interpret and transpile the source code;
【 plugins 】 enable bundle-optimizing 
*/

module.exports = {
    watch: true, // automatically rebuild when changes are made to source files (src目录)
    mode: "development", // 优先级 < package.json scripts字段的构建指令中的 --mode 配置
    
    // // 单入口单出口
    // entry: "./src/index.js",
    // output: {
    //     // // 方法1：filename文件名（默认输入至 dist目录）；
    //     // filename: "main.js",

    //     // // 方法2：filename文件相对路径；
    //     // filename: "../build/xtina.js",

    //     // // 方法3：filename文件名；path目录绝对路径
    //     // filename: "xtina.js",
    //     // path: "/Users/xtina_ac/Downloads/vue_projects/xtina_webpack/build"

    //     // 方法4：filename文件名； path采用path模块
    //     filename: "xtina.js",
    //     path: path.resolve(__dirname, 'build'),
    // },

    // 多入口多出口
    // entry: {
    //     xtina: "./src/index.js",
    //     aaron: "./src/index1.js"
    // },

    resolve: {
        // Add a [resolve.alias] to resources instead of using the complex relative/absolute path
        alias: {
            JsFolder: path.resolve(__dirname, 'src/scripts'),
            CssFolder: path.resolve(__dirname, 'src/styles'),
            ImgFolder: path.resolve(__dirname, 'src/images'),
        },
        // look for dependencies in [src/custom_libs] before the default [node_modules] dir
        // 例如：import $ from 'jquery' 先查找【src/custom_libs/jquery】, 若不存在则查找【node_modules/jquery】
        modules: [path.resolve(__dirname, 'src/custom_libs'), 'node_modules']
    },
    entry: {
        xtina: 'JsFolder/index.js',
        aaron: 'JsFolder/index1.js'
    },

    output: {
        // - - use the "entry" property names as substitution;
        // filename: "[name].js",
        // - - Any node on the network (e.g. reverse proxy caches, CDNs, gateway caches, web proxy caches etc.) 
        // between servers and browsers can potentially use caching to reduce load/traffic/latency.
        // - - But there're 3 ways of resource name versioning, used for Cache-Busting:
        // 1) file name versioning
        // 2) file path versioning
        // 3) query string versioning
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "build")
    },

    // By default, webpack will only minify JS files;
    // In order to minify CSS, use the plugin below:
    optimization:{
        minimizer: [
            // Setting [optimization.minimizer] overrides the default minimization
            // behavior of webpack, so we need to specify explicitly the Terser plugin(JS-minifier)
            new TerserJSPlugin({}),
            new OptimizeCssAssetsPlugin({})
        ]
    },
    plugins: [
        // simply creation of HTML files in which resource names include a changable hash
        // use instead /build/index.html as the final output HTML
        // use the original /index.html as template
        new HtmlWebpackPlugin({
            template: './index.html'
        }),

        // keep only the latest generated files and detele the rest
        new CleanWebpackPlugin(),

        // extract css to a separate file, instead of using style-loader to inject it
        // into index.html-><head>-><style> tags.
        new MiniCssExtractPlugin({
            //// use the "entry" property names as substitution
            // filename: 'xtina.css'
            filename: '[name].[contenthash].css'
        })
    ],
    module: {
        rules: [
            // 配置babel-loader，转编译es6语法
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },

            {
                test: /\.css$/i,
                // webpack从右向左读取配置；
                // 首先配置：css-loader，在js文件中引入css文件（转为CommonJs语法）；
                // 其次配置：style-loader，在html-<head>-<style>标签中插入css代码。
                // use: ['style-loader', 'css-loader']
                use: [
                    // 使用 MiniCssExtractPlugin 的 loader，取代 style-loader
                    MiniCssExtractPlugin.loader,

                    // postcss-loader cannot be used with CSS Modules out of the box
                    // solution1: add the css-loader's importLoaders option;
                    // solution2: use postcss-modules instead of css-loader.
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },

                    // postcss-loader helps give full support to CSS features
                    // by adding browser/vendor prefixes;
                    // it has to be used with the 'autoprefixer' plugin;
                    // it has to be loaded before the css-loader
                    // {
                    //     loader: 'postcss-loader',
                    //     options: {
                    //         plugins: [ 
                    //             require('postcss-preset-env')
                    //         ]
                    //     }
                    // },
                    
                    // postcss-loader当前版本不支持在webpack.config.js文件中配置options
                    // solution：根目录下新建postcss.config.js文件
                    'postcss-loader'
                ]
            },

            {
                test: /\.scss$/i,
                // 首先配置：sass-loader，在js文件中引入sass文件（并隐式调用node-sass将sass转编译为css）
                // 其次配置：css-loader、style-loader（同上）
                // use: ['style-loader', 'css-loader', 'sass-loader']
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },

            // //// handle other types files, e.g. images
            // {
            //     test: /\.(png|jpg|gif|svg|woff2?|eot|ttf|otf|wav)(\?.*)?$/i,
            //     type:'javascript/auto', //针对多余图片输入问题
            //     use: [
            //         {
            //             //// if the filesize < 256 bytes,
            //             //// [url-loader] will turn it to base64 code; otherwise,
            //             //// [file-loader] will be passed the same options and used.
            //             loader: 'url-loader',
            //             options: {
            //                 limit: 1024,
            //                 name: '[name].[hash:7].[ext]',
            //                 esModule: false //针对多余图片输入问题
            //             }
            //         },

            //         //// use [image-webpack-loader] to compress png/jpeg/gif/svg/webp images
            //         //// 安装过程：
            //         //// sudo npm install -g cnpm --registry=https://registry.npm.taobao.org
            //         //// cnpm install image-webpack-loader --save-dev --legacy-peer-deps
            //         {
            //             loader: 'image-webpack-loader'
            //         }
            //     ]
            // },

            // 更优雅的图片等资源文件打包方案：
            // https://www.ngui.cc/51cto/show-532838.html?action=onClick
            // https://www.cnblogs.com/Mr-Hou88888/p/16134208.html
            {
                test: /\.(png|jpg|gif|svg|woff2?|eot|ttf|otf|wav)(\?.*)?$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8*1024
                    }
                },
                generator: {
                    // 注意⚠️：这里的[ext]自带一个dot符
                    filename: 'img/[name].[hash:7][ext]'
                }
            }
        ]
    },
    // 【SourceMaps】: Mapping the bundled source code to the original source code, 
    // which is helpful for line debugging; See more details at:
    // https://webpack.js.org/guides/development/#using-source-maps
    devtool: "inline-source-map"
}