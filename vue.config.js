const TransformPages = require('uni-read-pages')
const {webpack} = new TransformPages()
module.exports = {
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				ROUTES: webpack.DefinePlugin.runtimeValue(() => {
					const tfPages = new TransformPages({
						includes: ['path', 'name', 'meta']
					});
					return JSON.stringify(tfPages.routes)
				}, true )
			})
		]
	},
	chainWebpack: (config) => {
		// 发行或运行时启用了压缩时会生效
		config.optimization.minimizer('terser').tap((args) => {
			const compress = args[0].terserOptions.compress
			// 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
			compress.drop_console = false // true = 移除 false = 不移除
			// compress.pure_funcs = [
			//     '__f__', // App 平台 vue 移除日志代码
			//     // 'console.debug' // 可移除指定的 console 方法
			// ]
			return args
		})
	},
	//开发模式反向代理配置，生产模式请使用Nginx部署并配置反向代理
	  devServer: {
	    port: 8080,
	    proxy: {
	      "/api": {
	        //本地服务接口地址
	        target: "https://www.wanandroid.com/",
	        ws: true,
	        pathRewrite: {
	          "^/api": "/",
	        },
	      },
	    },
	  }
}