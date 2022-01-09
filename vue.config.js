/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,

  devServer: {
    port: 9520,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^': '' },
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^': '' },
      },
    },
    // before: require('./mock/mock-server.ts'),
  },

  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': resolve('src'),
        // 解决 vue-i18n 开发环境下警告：
        // You are running the esm-bundler build of vue-i18n.
        // It is recommended to configure your bundler to explicitly replace feature flag globals with boolean literals to get proper tree-shaking in the final bundle.
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
      }),
    ],
  },

  chainWebpack: (config) => {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })
      .end();

    config.when(process.env.NODE_ENV !== 'development', (cfg) => {
      // cfg
      //   .plugin('ScriptExtHtmlWebpackPlugin')
      //   .after('html')
      //   .use('script-ext-html-webpack-plugin', [
      //     {
      //       // `runtime` must same as runtimeChunk name. default is `runtime`
      //       inline: /runtime\..*\.js$/,
      //     },
      //   ])
      //   .end();
      cfg.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          elementPlus: {
            name: 'chunk-elementPlus', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-plus(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      // https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
      cfg.optimization.runtimeChunk('single');
    });
  },

  pluginOptions: {
    i18n: {
      locale: 'zh-cn',
      fallbackLocale: 'zh-cn',
      localeDir: 'locales',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true,
    },
  },
};
