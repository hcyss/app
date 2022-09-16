import http from "@/data-package/utils/http/index.js";
import auth from "@/data-package/utils/auth.js";
import wxApi from "@/data-package/utils/api/wxApi.js"
import TipsType from "@/data-package/utils/tips-type.js"
import { showLoading, hideLoading, showTips, isResSuccess } from '@/data-package/utils/common.js'

/**
 * 任何方法中的 api链接 或 参数结构 有改变，
 * 都需要在url-constants文件新增版本说明描述，
 * 以便apidoc的不同版本文档正确生成
 */
import apiUrl from "./url-constants.js";

/**
 * 1. 微信code 换取 token
 */
const getTokenByWxCode = () => {
	return new Promise(async resolve => {
		// #ifdef MP-WEIXIN
		const resWX = await wxApi.requestAuthCode()
		if (isResSuccess(resWX)) {
			if (resWX.data != null) {
				const res = await http.post(apiUrl.GET_TOKEN, { code: resWX.data }, false)
				if (isResSuccess(res)) {
					auth.saveLoginInfo(res.data)
					// auth.setRefreshToken(res.data.refreshToken)
					resolve({
						"code": 1,
						"message": "成功",
						"data": null
					})
				}  else {
					resolve({
						"code": 0,
						"message": res.message || "失败",
						"data": null
					})
				}
			} else {
				resolve({
					"code": 0,
					"message": "微信授权失败",
					"data": null
				})
			}
		} else {
			resolve(res)
		}
		// #endif
		// #ifndef  MP-WEIXIN
			resolve({
				"code": 0,
				"message": "非微信客户端不可调用此方法",
				"data": null
			})
		// #endif
	});
};

/**
 * 2. 登录
 * @param {String} params.tenantId 租户id
 * @param {String} params.account 帐号
 * @param {String} params.password 密码
 * @param {Boolean} params.isBindWX 是否绑定微信  
 */
const login = (params) => {
	return new Promise(async resolve => {
		showLoading()
		let { tenantId, account, password, isBindWX } = params
		let wxCode = null
		// #ifdef MP-WEIXIN
			if (isBindWX) {
				const resWX = await wxApi.requestAuthCode()
				if (isResSuccess(resWX)) {
					wxCode = resWX.data
				} else {
					showTips({ type: TipsType.WARN,  message: '无法绑定，微信授权失败' })
				}
			}
		// #endif
		const res = await http.post(apiUrl.LOGIN, { tenantId, account, password, wxCode }, false)
		hideLoading()
		if (isResSuccess(res)) {
			auth.saveLoginInfo(res.data)
			resolve({
				"code": 1,
				"message": "登录成功",
				"data": null
			})
		} else {
			resolve({
				"code": 0,
				"message": res.message || "登录失败",
				"data": null
			})
		}
	})
}

// /**
//  * 2. 申请答题
//  */
// const requestQuestion = () => {
// 	return http.get(apiUrl.REQUEST_QUESTION, {}, true, {key1:1, key2:2, key3: "helloword"})
// }; 

// /**
//  * 3. 提交答案
//  * @param {array}  list
//  */
// const submitAnswer = (list) => {
// 	return simplePromise(list,
// 		(list) => list != null || list.length > 0, 
// 		(list) => http.post(apiUrl.SUBMIT_ANSWER, { list }, false)
// 	)
// };

// /**
//  * 4. 排行榜
//  */
// const rankingList = () => {
// 	return http.get(apiUrl.RANKING_LIST, null, true)
// };

// /**
//  * 5. 获取学校
//  */
// const loadSchool = (id) => {
// 	return simplePromise(id,
// 		(id) => id != null && id.trim().length > 0, 
// 		(id) => http.get(apiUrl.LOAD_SCHOOL, { id }, true)
// 	)
// };

// /**
//  * 6. 获取班级
//  */
// const loadClass = (id) => {
// 	return simplePromise(id, 
// 		(id) => id != null && id.trim().length > 0, 
// 		(id) => http.get(apiUrl.LOAD_CLASS, { id }, true)
// 	)
// };

// /**
//  * 7. 提交个人资料
//  */
// const bindUserInfo = (params) => {
// 	return simplePromise(params, 
// 		() => params != null, 
// 		(params) => {
// 			let { id, schoolId, schoolName, classId, className, phoneNumber, name } = params
// 			return http.post(apiUrl.BIND_USER_INFO, { id, schoolId, schoolName, classId, className, phoneNumber, name }, true)
// 		}
// 	)
// };

// /**
//  * 8. 查询个人资料
//  */
// const loadUserInfo = (isShowLoading) => {
// 	return http.get(apiUrl.LOAD_USER_INFO, null, isShowLoading)
// }

// /**
//  * 9. 关于游戏规则说明
//  */
// const aboutRuleInfo = () => {
// 	return http.get(apiUrl.ABOUT_RULE_INFO, null, true)
// }

// /**
//  * 10. 关于用户绑定信息说明
//  */
// const aboutBindInfo = () => {
// 	return http.get(apiUrl.ABOUT_BIND_INFO, null, true)
// }
// /**
//  * 11. 解析电话号码 
//  */
// const decodePhoneNumber = (phoneCode) => {
// 	return http.get(apiUrl.DECODE_PHONE_NUMBER, { code: phoneCode }, true)
// }
// /**
//  * 12. 获取学校等级
//  */
// const loadSchoolLevels = () => {
// 	return http.get(apiUrl.LOAD_SCHOOL_LEVELS, null, true)
// }

// /**
//  * 封装Promise，可对于空参数返回处理
//  */
// const simplePromise = (params, checkParamsCallback, requestCallback) => {
// 	return new Promise(resolve => {
// 		if (checkParamsCallback && checkParamsCallback(params)) {
// 			if (requestCallback) {
// 				resolve(requestCallback(params))
// 			}
// 		} else {
// 			resolve({
// 				"code": 0,
// 				"message": "请求参数不符合要求",
// 				"data": null
// 			})
// 		}
// 	})
// };

export default {
	getTokenByWxCode,
	login
	// requestQuestion,
	// submitAnswer,
	// rankingList,
	// loadSchool,
	// loadClass,
	// bindUserInfo,
	// loadUserInfo,
	// aboutRuleInfo,
	// aboutBindInfo,
	// decodePhoneNumber,
	// loadSchoolLevels
}
