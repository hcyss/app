/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
import Config from "./config.js"
import UploadConfig from "./uploadConfig.js"
import Interceptor from "./interceptor.js"

// 拦截器（请求和响应）
const interceptor = Interceptor

/**
 * 初始化请求配置（非文件上传配置）
 */
const initConfig = () => {
	let _config = JSON.parse(JSON.stringify(Config))
	_config.baseUrl = ""
	_config.header = {
			'Content-Type': 'application/json; charset=UTF-8',
			// 'application/x-www-form-urlencoded; charset=UTF-8',
		}
	_config.data = {}
	_config.method = "GET"
	_config.dataType = "json"  /* 如设为json，会对返回的数据做一次 JSON.parse */
	_config.responseType = "text"
	_config.isShowMask = true // 是否显示蒙层
	_config.success = () => {}
	_config.fail = () => {}
	_config.complete = () => {}
	return _config
}

/**
 * 初始化请求配置（文件上传配置）
 */
const initUploadConfig = () => {
	let _config = JSON.parse(JSON.stringify(UploadConfig))
	_config.baseUrl = ""
	_config.header = {
			'Content-Type':'multipart/form-data',
		}
	_config.name = "file"
	_config.formData = {}
	_config.isShowMask = true // 是否显示蒙层
	_config.success = () => {}
	_config.fail = () => {}
	_config.complete = () => {}
	return _config
}

// 默认的配置
const config = initConfig()

const uploadConfig = initUploadConfig()

/**
 * 合并两段链接
 * @param {String} baseUrl 基地址链接
 * @param {String} methodUrl 方法链接
 */
const mergeUrl = (baseUrl, methodUrl) => {
	let hasBaseUrlEnd = baseUrl.endsWith('/') // 基地址有结尾斜杠
	let hasMethodUrlStart =  methodUrl.startsWith('/') //方法链接有开头斜杠
	let url = ""
	if (hasBaseUrlEnd && hasMethodUrlStart) { 
		// 都有斜杠，删除一个
		url = `${baseUrl}${methodUrl.substr(1, methodUrl.length - 1)}`
	} else 
	if (!hasBaseUrlEnd && !hasMethodUrlStart) {
		// 都没有斜杠，中间加一个
		url = `${baseUrl}/${methodUrl}`
	} else {
		// 一个有一个没有的情况，直接合并即可
		url = `${baseUrl}${methodUrl}`
	}
	return url
}

/**
 * 请求接口日志记录
 * @param {Object} req
 */
const reqLog = (req) => {
	// if (process.env.NODE_ENV === 'development') {
		console.log("【" + req.requestId + "】 地址：" + req.url)
		if (req.data) {
			console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
		}
	// }
	//TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 * @param {Object} res
 * @param {Object} config
 */
const resLog = (res, config) => {
	let _statusCode = res.statusCode;
	// if (process.env.NODE_ENV === 'development') {
		console.log("【" + config.requestId + "】 地址：" + config.url)
		if (config.data) {
			console.log("【" + config.requestId + "】 请求参数：" + JSON.stringify(config.data))
		}
		console.log("【" + config.requestId + "】 响应结果：" + JSON.stringify(res))
	// }
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch(_statusCode){
		case 200:
			break;
		case 401:
			break;
		case 404:
			break;
		default:
			break;
	}
}


/**
 * 为兼容小程序，只能单个文件上传
 */
const upload = (options) => {
	// if (!options) {
	// 	options = initUploadConfig()
	// } 
	// options.baseUrl = options.baseUrl || uploadConfig.baseUrl
	// options.isShowMask = options.isShowMask != null?options.isShowMask:uploadConfig.isShowMask
	// options.url = mergeUrl(options.baseUrl, options.methodUrl) 
	// options.formData = options.formData || {}
	// options.filePath = options.filePath || null
	
	let defaultConfig = initUploadConfig()
	if (!options) {
		options = defaultConfig
	} else {
		let header = Object.assign(defaultConfig.header, options.header)
		options = Object.assign(defaultConfig, options)
		options.header = header
	}
	
	return new Promise((resolve, reject) => {
		// let _config = null
		options.complete = async(response) => {
			let statusCode = response.statusCode
			// response.config = _config
			if (interceptor.response) {
				let newResponse = await interceptor.response({response, config: options})
				if (newResponse) {
					response = newResponse
				}
			}
			// 统一的响应日志记录
			printLog(response, options)
			if (statusCode === 401) {
				// 已经拦截，无需再处理
				// reject({
				// 	"code": 0,
				// 	"message": "鉴权失败",
				// 	"data": null
				// })
			} else 
			if (statusCode === 200) {
				resolve(response.data)
			} else {
				if (response.errMsg != null) {
					if (response.errMsg.indexOf('timeout') != -1) {
						resolve({
							"code": 0,
							"message": "请求超时",
							"data": null
						})
					} else {
						resolve({
							"code": 0,
							"message": "请求失败",
							"data": null
						})
					}
				} else {
					resolve({
							"code": 0,
							"message": "请求失败",
							"data": null
						})
				}
			}
		}
		// _config = Object.assign({}, uploadConfig, options)
		// _config.requestId = new Date().getTime()
		options.requestId = new Date().getTime()
		options.url = mergeUrl(options.baseUrl, options.methodUrl)
		if (interceptor.request) {
			interceptor.request(options)
		}
		// 统一的请求日志记录
		printLog(options)
		uni.uploadFile(options)
	})
}

/**
 * 请求通用方法（post、get）
 */
const request = (options) => {
	// if (!options) {
	// 	options = initConfig()
	// }
	// options.baseUrl = options.baseUrl || config.baseUrl
	// options.isShowMask = options.isShowMask != null?options.isShowMask:config.isShowMask
	// options.dataType = options.dataType || config.dataType
	// options.url = mergeUrl(options.baseUrl, options.name) 
	// options.data = options.data || {}
	// options.method = options.method || config.method
	let defaultConfig = initConfig()
	if (!options) {
		options = defaultConfig
	} else {
		let header = Object.assign(defaultConfig.header, options.header)
		options = Object.assign(defaultConfig, options)
		options.header = header
	}
	return new Promise((resolve, reject) => {
		// let _config = null
		options.complete = async(response) => {
			let statusCode = response.statusCode
			// response.config = _config
			if (interceptor.response) {
				let newResponse = await interceptor.response({response, config: options})
				if (newResponse) {
					response = newResponse
				}
			}
			// 统一的响应日志记录
			resLog(response, options)
			if (statusCode === 401) {
				// resolve(response)
			} else 
			if (statusCode === 200) {
				resolve(response.data)
			} else {
				if (response.errMsg != null) {
					if (response.errMsg.indexOf('timeout') != -1) {
						resolve({
							"code": 0,
							"message": "请求超时",
							"data": null
						})
					} else {
						resolve({
							"code": 0,
							"message": "请求失败",
							"data": null
						})
					}
				} else {
					resolve({
							"code": 0,
							"message": "请求失败",
							"data": null
						})
				}
			}
		}
		// _config = Object.assign({}, config, options)
		options.requestId = new Date().getTime()
		options.url = mergeUrl(options.baseUrl, options.name)
		if (interceptor.request) {
			interceptor.request(options)
		}
		// 统一的请求日志记录
		reqLog(options)
		uni.request(options)
	});
}

const get = (url, data, options) => {
	if (!options) {
		options = {}
	}
	options.url = url
	options.data = data
	options.method = 'GET'  
	return request(options)
}

const post = (url, data, options) => {
	if (!options) {
		options = {}
	}
	options.url = url
	options.data = data
	options.method = 'POST'
	return request(options)
}

const put = (url, data, options) => {
	if (!options) {
		options = {}
	}
	options.url = url
	options.data = data
	options.method = 'PUT'
	return request(options)
}

const del = (url, data, options) => {
	if (!options) {
		options = {}
	}
	options.url = url
	options.data = data
	options.method = 'DELETE'
	return request(options)
}


export default {
	interceptor,
	request,
	upload,
	get,
	post,
	put,
	del,
};
