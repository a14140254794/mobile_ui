const path = require('path');
const os = require('os');
const vConsolePlugin = require('vconsole-webpack-plugin'); // 引入 移动端模拟开发者工具 插件 （另：https://github.com/liriliri/eruda）
const CompressionPlugin = require('compression-webpack-plugin'); //Gzip
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //Webpack包文件分析器
const baseUrl = process.env.NODE_ENV === "production" ? "/static/" : "/"; //font scss资源路径 不同环境切换控制

const _proxy = {
  '/api': {
    target: 'http://182.92.234.178:30001/', //API服务器的地址
    ws: true,  //代理websockets
    changeOrigin: true, // 虚拟的站点需要更管origin
    pathRewrite: {   //重写路径
      '^/api': ''
    }
  }
}
//获取ip
function getIp() {
  let ifaces = os.networkInterfaces()
  let ip = '',
    result = []
  for (var dev in ifaces) {
    ifaces[dev].forEach(function(details) {
      if (ip === '' && details.family === 'IPv4' && !details.internal) {
        ip = details.address
        return;
      }
    })
  }
  return ip || '127.0.0.1'
}

module.exports = {
  publicPath:'./',
  outputDir: 'dist',   //build输出目录
  assetsDir: 'static', //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  lintOnSave: false, // eslint-loader 是否在保存的时候检查
  pages: undefined,//以多页模式构建应用程序。
  runtimeCompiler: false,//是否使用包含运行时编译器的 Vue 构建版本
  parallel: require('os').cpus().length > 1,//是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
  productionSourceMap: false, //生产环境是否生成 sourceMap 文件，一般情况不建议打开
  devServer: {
    open: true, //是否自动弹出浏览器页面
    host: getIp(),
    port: '30006',
    https: false,   //是否使用https协议
    hotOnly: false, //是否开启热更新
    proxy: _proxy,
  },
  configureWebpack: config => {
    //去除console
    if(process.env.NODE_ENV === 'production'){
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
    //生产and测试环境
    let pluginsPro = [
      new CompressionPlugin({ //文件开启Gzip，也可以通过服务端(如：nginx)(https://github.com/webpack-contrib/compression-webpack-plugin)
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$', ),
        threshold: 8192,
        minRatio: 0.8,
      }),
      //	Webpack包文件分析器(https://github.com/webpack-contrib/webpack-bundle-analyzer)
      new BundleAnalyzerPlugin(),
    ];
    //手机端调试
    // config.plugins.push(
    //   new vConsolePlugin({
    //     filter: [], // 需要过滤的入口文件
    //     enable: process.env.NODE_ENV === "development" // 生产环境不打开
    //   })
    // )
  },
}
