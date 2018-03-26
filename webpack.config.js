const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[chunkhash].js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, "src")],
        loader: 'babel-loader',                
      }
    ]
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src"),
    ],
    extensions: [".js", ".json", ".jsx", ".css"],
  },
  performance: {
    hints: "warning", // 枚举
    maxAssetSize: 200000, // 整数类型（以字节为单位）
    maxEntrypointSize: 400000, // 整数类型（以字节为单位）
    assetFilter: function(assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  // optimization: {
  //   minimize: true
  // },
  devtool: "source-map", // enum
  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  // 牺牲了构建速度的 `source-map' 是最详细的。

  context: __dirname, // string（绝对路径！）
  // webpack 的主目录
  // entry 和 module.rules.loader 选项
  // 相对于此目录解析

  target: "web", // 枚举
  // 包(bundle)应该运行的环境
  // 更改 块加载行为(chunk loading behavior) 和 可用模块(available module)

  externals: ["react", /^@angular\//],
  // 不要遵循/打包这些模块，而是在运行时从环境中请求他们

  stats: "errors-only",
  // 精确控制要显示的 bundle 信息

  devServer: {
    // proxy: { // proxy URLs to backend development server
    //   '/api': 'http://localhost:3000'
    // },
    contentBase: path.join(__dirname, 'dist'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    // ...
  },

  plugins: [
    new HtmlWebpackPlugin({template: './index.html'}),
  ],
}