import http from './interface.js'
import auth from '@/data-package/utils/auth.js'
import apiUrl from '@/data-package/utils/api/url-constants.js'
import Config from './config.js'
import UploadConfig from './uploadConfig.js'
import Mock from '@/data-package/utils/mock.js'
import TipType from '@/data-package/utils/tips-type.js'
import { isUseTestData, showTips, showDialog, showLoading, hideLoading, isResSuccess } from '@/data-package/utils/common.js'


const AUTH = "Authorization" // 请求头token参数名
const MAX_COUNT = 1 // 同一个方法连续尝试N次取token后还是响应401,就跳出重试循环
const REFRESH_TOKEN_METHOD_NAME = apiUrl.GET_TOKEN // 重置token的方法名 


// 401时候挂起的方法链接及重试次数
const tryMethod = { 
	url: "",
	tryCount: 0
}

/**
 * 根据请求方法链接，获取token
 */
const getToken = (methodName) => {
	// if (REFRESH_TOKEN_METHOD_NAME === methodName) {
	// 	return auth.getRefreshToken()
	// } else 
	if (apiUrl.loadWhiteList().indexOf(methodName) != -1) {
		// 白名单链接无需token
		return ""
	} else {
		return auth.getToken()
	}
}

/**
 * 上传文件
 * @param {string} url 方法的相对链接
 * @param {filePath} string 文件路径
 * @param {object} formData 参数
 * @param {boolean} isShowMask 是否显示遮罩层
 * @param {object} header 请求头
 */
const upload = ( url, filePath, formData = {}, isShowMask = true, header) => {
	if (filePath == null || filePath.trim().length === 0) {
		showTips({
			type: TipsType.WARN,
			message: '上传文件为空'
		})
		return
	}
	try {
		if (isUseTestData()) {
			return Mock.post(url, {filePath, formData}, isShowMask)
		}
	} catch(e) {
		console.log(e)
	}
	// 设置请求拦截器
	http.interceptor.request = (uploadConfig) => {
		console.log("请求拦截")
		if (uploadConfig.isShowMask) {
			showLoading()
		}
		let token = getToken(uploadConfig.methodUrl)
		console.log(`${AUTH} = ${token}`);
		delete uploadConfig.header[AUTH]
		if(token) {
			uploadConfig.header[AUTH] = token
		}
	}
	// 设置响应拦截器
	http.interceptor.response = async ({response, uploadConfig}) => {
		console.log("响应拦截")
		const statusCode = response.statusCode
		// 拦截401，重新换取token
		if (statusCode === 401) { 
			// 对触发401的方法做尝试计数，避免陷入不停401请求的死循环
			if(tryMethod.url === uploadConfig.methodUrl) {
				tryMethod.tryCount += 1
			} else {
				tryMethod.url = uploadConfig.methodUrl
				tryMethod.tryCount = 1
			}
			if(tryMethod.tryCount > MAX_COUNT) {
				naviToLoginPage();
			} else {
				console.log(`尝试第${tryMethod.tryCount}次`)
				response = await doRefreshToken({response, uploadConfig, isUploadFile: true})
			}
		} else if(statusCode === 404) {
			showTips({
				type: TipsType.ERROR,
				message: '请求方法不存在'
			})
		} else if(statusCode === 500 || statusCode === 550) {
			showTips({
				type: TipsType.ERROR,
				message: '服务器错误，请稍后再试'
			})
		}
		if (uploadConfig.isShowMask) {
			hideLoading()
		}
		return response
	}
	let uploadConfig = JSON.parse(JSON.stringify(UploadConfig))
	uploadConfig.baseUrl = apiUrl.getBaseUrl()
	uploadConfig.header = Object.assign(uploadConfig.header, header)
	uploadConfig.methodUrl = url
	uploadConfig.filePath = filePath
	uploadConfig.formData = formData
	// config.fileType = 'image'
	uploadConfig.isShowMask = isShowMask
	return http.upload(uploadConfig)
}

/**
 * 处理请求的统一入口（上传文件除外）
 * @param {string} url 方法的相对链接
 * @param {object} data 数据
 * @param {string} method 请求类型 "GET"  或 "POST"
 * @param {boolean} isShowMask 是否显示遮罩层
 * @param {object} header 请求头
 */
const excute = (url, data = {}, method, isShowMask = true, header = {}) => {
	try {
		if (isUseTestData()) {
			return Mock.request(url, data, method, isShowMask)
		}
	} catch(e) {
		console.log(e)
	}
	
	// 设置请求拦截器
	http.interceptor.request = (config) => {
		console.log("请求拦截")
		if (config.isShowMask) {
			showLoading()
		}
		let token = getToken(config.name)
		console.log(`${AUTH} = ${token}`);
		delete config.header[AUTH]
		if(token) {
			config.header[AUTH] = token
		}
	}
	// 设置响应拦截器
	http.interceptor.response = async ({response, config}) => {
		console.log("响应拦截")
		const statusCode = response.statusCode
		// 拦截401，重新换取token
		if (statusCode === 401) { 
			// 对触发401的方法做尝试计数，避免陷入不停401请求的死循环
			if(tryMethod.url === config.name) {
				tryMethod.tryCount += 1
			} else {
				tryMethod.url = config.name
				tryMethod.tryCount = 1
			}
			if(tryMethod.tryCount > MAX_COUNT) {
				naviToLoginPage();
			} else {
				console.log(`尝试第${tryMethod.tryCount}次`)
				response = await doRefreshToken({response, config, isUploadFile: false})
			}
		} else if(statusCode === 404) {
			showTips({
				type: TipsType.ERROR,
				message: '请求方法不存在'
			})
			
		} else if(statusCode === 500 || statusCode === 550) {
			showTips({
				type: TipsType.ERROR,
				message: '服务器错误，请稍后再试'
			})
		}
		if (config.isShowMask) {
			hideLoading()
		}
		return response
	}
	let config = JSON.parse(JSON.stringify(Config)) 
	config.baseUrl = apiUrl.getBaseUrl()
	config.header = Object.assign(config.header, header)
	config.name = url
	config.method = method
	config.dataType = 'json'
	config.data = data
	config.isShowMask = isShowMask
	return http.request(config)
}

/**
 * 清除null的参数
 */
const removeNullParams = (data) => {
	if (data == null) return data
	const names = Object.getOwnPropertyNames(data)
	for (let i = 0; i < names.length; i++) {
		let name = names[i]
		let value = data[name]
		if (value == null) {
			delete data[name]
		}
	}
	return data
}

// 刷新 token 方法
const doRefreshToken = async ({response, config, isUploadFile}) => {
	const res = await api.refreshToken()
	const {
		data
	} = res
	if (isResSuccess(res)) {
		auth.setToken(data) // 保存更新的token
		// auth.setRefreshToken(data.refreshToken) // 保存更新的refreshToken
		// 重新发起请求
		let resold 
		if (isUploadFile) {
			resold = await uploadFile(config.methodUrl, config.filePath, config.formData, config.isShowMask)
		} else {
			resold = await excute(config.name, { ...config.data}, config.method, config.isShowMask)
		}
		return resold
	}
	naviToLoginPage()
	return response
}

const naviToLoginPage = () => {
	// uni.hideLoading()
	hideLoading()
	auth.removeLoginInfo()
	tryMethod = {
		url: "",
		tryCount: 0
	}
	let callback = () => {
			uni.reLaunch({
				url: '/pages/index/index',
			})
	}
	showDialog({
		content: "授权超时，请重新登录。", 
		confirmText: "好的", 
		confirm: callback
	})
}
		
const get = (url, data = {}, isShowMask = true, header = {}) => {
	return excute(url, data, 'GET', isShowMask, header)
}

const post = (url, data = {}, isShowMask = true, header = {}) => {
	return excute(url, data, 'POST', isShowMask, header)
}

export default {
	get,
	post
}
