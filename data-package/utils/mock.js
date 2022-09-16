import url from "@/data-package/utils/api/url-constants.js"
import { showLoading, hideLoading } from '@/data-package/utils/common.js'
// 这里存放的是静态数据的映射关系

const UNDEFIND_JSON_DATA = "not_find_json_err.json" // 未匹配的测试请求，将返回到此静态数据

// api链接与静态数据的映射关系
const apiUrlMapping = [
	{url: url.GET_TOKEN, json: "login.json"},
	{url: url.LOGIN, json: "login.json"},
]
	
// api链接，参数值与静态数据的映射关系
const dictMapping = [
	// {
	// 	url: url.LOAD_SCHOOL_LEVELS,  // 链接
	// 	filedName: 'code', // 参数名
	// 	dict: [ // 键值与静态数据的映射
	// 		{value: 1, json: "loadDictBaseType.json"},
	// 		{value: 2, json: "loadDictBaseType.json"}
	// 	],
	// },
]

/**
 * 根据请求方法链接，请求参数，获取静态数据json文件名(兼容字典接口，及业务逻辑)
 * @param {String} url 请求链接
 * @param {Object | Array} params 请求参数
 */
const findJsonFileName = (url, params) => {
	let json = findJsonFileByDict(url, params)
	if (json) {
		return json
	}
	return findJsonFileNameByUrl(url)
}

/**
 * 根据请求方法链接，获取静态数据json文件名
 * @param {String} url 请求链接
 */
const findJsonFileNameByUrl = (url) => {
	if (!url) return null
	for (let i = 0; i < apiUrlMapping.length; i++) {
		if(apiUrlMapping[i].url === url) {
			return apiUrlMapping[i].json
		}
	}
	// 找不到映射关系的情况下，就按url作为静态文件名返回
	let paths = url.split('/') // 取链接最后的方法名
	let methodName = paths[paths.length -1].split('?')[0] // 防止链接最后带get参数，把参数去掉
	return `${methodName}.json` 
}

/**
 * 根据链接和参数获取字典映射的静态数据
 * @param {String} url 请求链接
 * @param {Object} params 请求参数
 */
const findJsonFileByDict = (url, params) => {
	if (!url || params == null || Array.isArray(params) || Object.keys(params).length === 0) return null
	for (let item of dictMapping) {
		if (item.url === url && Object.keys(params).some(it => item.filedName)) {
			let filedValue = params[item.filedName]
			let arr = item.dict.filter(it => it.value === filedValue)
			if (arr.length > 0) {
				return arr[0].json
			} else {
				return null
			}
		} 
	}
	return null
}

/**
 * 返回静态数据
 */
const getStaticFile = (jsonPath) => {
	return require(`@/data-package/static/test/${jsonPath}`)
}

/**
 * 模拟请求
 */
const request = (url, data = {}, method, isShowMask = true) => {
	if (isShowMask) {
		showLoading()
	}
	return new Promise((resolve, reject) => {
		if (method) {
			console.log(`${method}请求\n方法 = ${url}\n参数 = ${JSON.stringify(data)}`);
		} else {
			console.log(`方法 = ${url}\n参数 = ${JSON.stringify(data)}`);
		}
		// 模仿网络请求的延时
		setTimeout(() => {
			let jsonPath = findJsonFileName(url, data)
			if (isShowMask) {
				hideLoading()
			}
			if (jsonPath != null) {
				try {
					let json = getStaticFile(jsonPath)
					// console.log(`响应方法 = ${url}\njson = ${jsonPath}\n数据 = ${JSON.stringify(json)}`);
					resolve(JSON.parse(JSON.stringify(json)))
				} catch {
					let json = getStaticFile(UNDEFIND_JSON_DATA)
					// console.log(`响应方法 = ${url}\njson = ${jsonPath}\n数据 = ${JSON.stringify(json)}`);
					resolve(JSON.parse(JSON.stringify(json)))
				}
			} else {
				let json = getStaticFile(UNDEFIND_JSON_DATA)
				// console.log(`响应方法 = ${url}\njson = ${jsonPath}\n数据 = ${JSON.stringify(json)}`);
				resolve(JSON.parse(JSON.stringify(json)))
			}
			
		}, 500)
	})
}

/**
 * 模拟get请求
 */
const get = (url, data = {}, isShowMask = true) => {
	request(url, data, 'get', isShowMask)
}

/**
 * 模拟post请求
 */
const post = (url, data = {}, isShowMask = true) => {
	request(url, data, 'post', isShowMask)
}

export default {
	request,
	get,
	post
}