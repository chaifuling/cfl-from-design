const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');

const minify = process.env.NODE_ENV === 'development' ? false : {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true
}




function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  assetsDir: 'assets',
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        sassOptions: {
          fiber: require('fibers')
        }
      }
    }
  },
  publicPath: './',
  runtimeCompiler: true,
  pages: {
    index: {
      entry: 'src/views/index/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      minify
    },
    preview: {
      entry: 'src/views/preview/main.js',
      template: 'public/preview.html',
      filename: 'preview.html',
      chunks: ['chunk-vendors', 'chunk-common', 'preview'],
      minify
    }
  },
  devServer: {
    overlay: false
  },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      }),
      // new webpack.ProvidePlugin({
      //   Vue: ['vue/dist/vue.esm.js', 'default']
      // })
    ],
    output: {
      libraryExport: 'default',
      library: 'FromDesign',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },

    // messages: 打包组件库去掉vue依赖 避免引入库冲突
    externals: ['vue'],
  },
  chainWebpack(config) {
    // config.plugin('copy').use(require('copy-webpack-plugin'), [
    //   [
    //     {
    //       from: path.resolve(__dirname, './public'),
    //       to: path.resolve(__dirname, './lib'),
    //       toType: 'dir',
    //       ignore: ['index.html']
    //     }
    //   ]
    // ]);
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 8192, // 小于 8KB 的文件会被转换为 base64 格式
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]', // 输出的文件名格式
          },
        },
      })
      .end();
    config.resolve.alias
      .set('@$', resolve('src'))
    config.module.rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        // 修改选项...
        return options
      })
  }
}
