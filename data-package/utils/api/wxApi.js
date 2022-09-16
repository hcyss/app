import auth from '@/data-package/utils/auth.js'
import { isUseTestData } from '@/data-package/utils/common.js'
// 封装的微信api

// AppID(小程序ID)：
// const APP_ID = ''
// AppSecret(小程序密钥)：
// const APP_SECRET = ''

// 登录模式 返回 authCode
// const MODE_RESULT_AUTH_CODE = 0
// 登录模式 返回 openId
// const MODE_RESULT_OPEN_ID = 1

/**
 * 获取authCode
 */
const requestAuthCode = () => {
	return new Promise(resolve => {
		// #ifdef MP-WEIXIN
		if (isUseTestData()) {
			resolve({
				"code": 1,
				"message": "成功",
				"data": "wxCode"
			})
		}else {
			uni.getProvider({
				service: 'oauth',
				success: (res) => {
					if (~res.provider.indexOf('weixin')) {
						uni.login({
							provider: 'weixin',
							success: (res) => {
								console.log(`authCode = ${JSON.stringify(res)}`)
								if (res.errMsg === "login:ok" && res.code != null && res.code.trim().length > 0) {
									resolve({
										"code": 1,
										"message": "成功",
										"data": res.code
									})
								} else {
									resolve({
										"code": 0,
										"message": "微信登录授权失败",
										"data": null
									})
								}
							},
							fail: () => {
								resolve({
									"code": 0,
									"message": "微信登录授权失败",
									"data": null
								})
							}
						});
					}
				},
				fail: () => {
					resolve({
						"code": 0,
						"message": "微信登录授权失败",
						"data": null
					})
				}
			});
		}
		// #endif
		// #ifndef  MP-WEIXIN
		resolve({
			"code": 0,
			"message": "非微信客户端不可调用此方法",
			"data": null
		})
		// #endif
	})
}

/**
 * 获取 openId
 * @param {String} appId
 * @param {String} appSecret
 * @param {String} authCode
 */
// const requestOpenId = (appId, appSecret, authCode) => {
// 	return new Promise(resolve => {
// 		// #ifdef MP-WEIXIN
// 		uni.request({
// 			url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${authCode}&grant_type=authorization_code`,
// 			header: {
// 				"Content-Type": "application/x-www-form-urlencoded"
// 			},
// 			method: 'GET',
// 			success: res => {
// 				if (res.errMsg === "request:ok") {
// 					let openId = res.data.openid
// 					auth.setOpenId(openId)
// 					resolve({
// 						"code": 1,
// 						"message": "成功",
// 						"data": openId
// 					})
// 				} else {
// 					auth.removeOpenId()
// 					resolve({
// 						"code": 0,
// 						"message": "微信OpenId获取失败",
// 						"data": null
// 					})
// 				}
// 			},
// 			fail: () => {
// 				auth.removeOpenId()
// 				resolve({
// 					"code": 0,
// 					"message": "微信OpenId获取失败",
// 					"data": null
// 				})
// 			}
// 		})
// 		// #endif
// 		// #ifndef  MP-WEIXIN
// 		resolve({
// 			"code": 0,
// 			"message": "非微信客户端不可调用此方法",
// 			"data": null
// 		})
// 		// #endif
// 	})
// }

/**
 * 获取authCode并转换为openId
 */
// const requestAuthCode2OpenId = () => {
// 	return new Promise(async resolve => {
// 		let codeRes = await requestAuthCode()
// 		if (codeRes.code === 1) {
// 			let authCode = codeRes.data
// 			resolve(requestOpenId(APP_ID, APP_SECRET, authCode))
// 		} else {
// 			resolve(codeRes)
// 		}
// 	})
// }

/**
 * 微信授权
 * @param {Number} 模式 0 = 返回authCode, 1 = 返回openId 
 */
// const authByMode = (mode = MODE_RESULT_AUTH_CODE) => {
// 	return new Promise(resolve => {
// 		// #ifdef MP-WEIXIN
// 		uni.checkSession({
// 			success: () => {
// 				if (MODE_RESULT_AUTH_CODE === mode) {
// 					resolve(requestAuthCode())
// 				} else
// 				if (MODE_RESULT_OPEN_ID === mode) {
// 					let openId = auth.getOpenId()
// 					if (openId == null || openId.trim().length === 0) {
// 						resolve(requestAuthCode2OpenId())
// 					} else {
// 						console.log('有openId缓存');
// 						resolve({
// 							"code": 1,
// 							"message": "成功",
// 							"data": openId
// 						})
// 					}
// 				} else {
// 					resolve({
// 						"code": 0,
// 						"message": "错误的登录模式",
// 						"data": null
// 					})
// 				}
// 			},
// 			fail: () => {
// 				auth.removeLoginInfo()
// 				if (MODE_RESULT_AUTH_CODE === mode) {
// 					resolve(requestAuthCode())
// 				} else
// 				if (MODE_RESULT_OPEN_ID === mode) {
// 					resolve(requestAuthCode2OpenId())
// 				} else {
// 					resolve({
// 						"code": 0,
// 						"message": "错误的登录模式",
// 						"data": null
// 					})
// 				}
// 			}
// 		})
// 		// #endif
// 		// #ifndef MP-WEIXIN
// 		resolve({
// 			"code": 0,
// 			"message": "非微信客户端不可调用此方法",
// 			"data": null
// 		})
// 		// #endif
// 	})
// }

/**
 * 获取用户授权信息（新版api）
 */
const getUserProFile = () => {
	return new Promise(resolve => {
		// #ifdef MP-WEIXIN
		uni.getUserProfile({
			desc: "获取您的昵称、头像、地区及性别",
			success: (res) => {
				if (res.errMsg === "getUserProfile:ok") {
					let avatarUrl = res.userInfo.avatarUrl
					let nickName = res.userInfo.nickName
					auth.setNickName(nickName)
					auth.setAvatar(avatarUrl)
					resolve({
						"code": 1,
						"message": "成功",
						"data": {
							avatarUrl,
							nickName
						}
					})
				} else {
					resolve({
						"code": 0,
						"message": "获取用户信息失败",
						"data": null
					})
				}
			},
			fail: (fail) => {
				resolve({
					"code": 0,
					"message": "获取用户信息失败",
					"data": null
				})
			}
		})
		// #endif
		// #ifndef MP-WEIXIN
		resolve({
			"code": 0,
			"message": "非微信客户端不可调用此方法",
			"data": null
		})
		// #endif
	})
}

const getUserInfo = () => {
	return new Promise(resolve => {
		// #ifdef MP-WEIXIN
		uni.getUserInfo({
			provider: 'weixin',
			success: (res) => {
				if (res.errMsg === "getUserInfo:ok") {
					let avatarUrl = res.userInfo.avatarUrl
					let nickName = res.userInfo.nickName
					auth.setNickName(nickName)
					auth.setAvatar(avatarUrl)
					resolve({
						"code": 1,
						"message": "成功",
						"data": {
							avatarUrl,
							nickName
						}
					})
				} else {
					resolve({
						"code": 0,
						"message": "获取用户信息失败",
						"data": null
					})
				}
			},
			fail: (fail) => {
				resolve({
					"code": 0,
					"message": "获取用户信息失败",
					"data": null
				})
			}
		})
		// #endif
		// #ifndef MP-WEIXIN
		resolve({
			"code": 0,
			"message": "非微信客户端不可调用此方法",
			"data": null
		})
		// #endif
	})
}

const requestUserProFile = () => {
	return new Promise(resolve => {
		// #ifdef MP-WEIXIN
		let nickName = auth.getNickName(nickName)
		let avatarUrl = auth.getAvatar()
		if (nickName != null && nickName.trim().length > 0 &&
			avatarUrl != null && avatarUrl.trim().length > 0) {
			resolve({
				"code": 1,
				"message": "成功",
				"data": {
					avatarUrl,
					nickName
				}
			})
		} else
		if (uni.getUserProfile) { // 判断新版本api是否存在
			resolve(getUserProFile())
		} else {
			resolve(getUserInfo())
		}
		// #endif
		// #ifndef  MP-WEIXIN
		resolve({
			"code": 0,
			"message": "非微信客户端不可调用此方法",
			"data": null
		})
		// #endif
	})
}

/**
 * 获取accessToken
 * @param {String} appId
 * @param {String} appSecret    
 */
// const requestAccessToken = (appId, appSecret) => {
// 	return new Promise(resolve => {
// 		// #ifdef MP-WEIXIN
// 		uni.request({
// 			url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
// 			header: {
// 				"Content-Type": "application/x-www-form-urlencoded"
// 			},
// 			method: 'GET',
// 			success: res => {
// 				if (res.errMsg === "request:ok") {
// 					resolve({
// 						"code": 1,
// 						"message": "成功",
// 						"data": res.data.access_token
// 					})
// 				} else {
// 					resolve({
// 						"code": 0,
// 						"message": "获取token失败",
// 						"data": null
// 					})
// 				}
// 			},
// 			fail: () => {
// 				resolve({
// 					"code": 0,
// 					"message": "获取token失败",
// 					"data": null
// 				})
// 			}
// 		})
// 		// #endif
// 		// #ifndef MP-WEIXIN
// 		resolve({
// 			"code": 0,
// 			"message": "非微信客户端不可调用此方法",
// 			"data": null
// 		})
// 		// #endif
// 	})
// }

/**
 * 解码电话号码
 * @param {String} accessToken
 * @param {String} code  
 */
// const decodePhoneNumberCode = (accessToken, code) => {
// 	return new Promise(resolve => {
// 		// #ifdef MP-WEIXIN
// 		if (accessToken == null || accessToken.trim().length === 0) {
// 			resolve({
// 				"code": 0,
// 				"message": "token不可为空",
// 				"data": null
// 			})
// 		} else
// 		if (code == null || code.trim().length === 0) {
// 			resolve({
// 				"code": 0,
// 				"message": "code不可为空",
// 				"data": null
// 			})
// 		} else {
// 			uni.request({
// 				url: `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`,
// 				data: {
// 					code
// 				},
// 				method: 'POST',
// 				success: res => {
// 					if (res.errMsg === "request:ok" && res.data.errmsg === "ok") {
// 						resolve({
// 							"code": 1,
// 							"message": "成功",
// 							"data": res.data.phone_info.phoneNumber
// 						})
// 					} else {
// 						resolve({
// 							"code": 0,
// 							"message": "解码联系号码失败",
// 							"data": null
// 						})
// 					}
// 				},
// 				fail: () => {
// 					resolve({
// 						"code": 0,
// 						"message": "解码联系号码失败",
// 						"data": null
// 					})
// 				}
// 			})
// 		}
// 		// #endif
// 		// #ifndef MP-WEIXIN
// 		resolve({
// 			"code": 0,
// 			"message": "非微信客户端不可调用此方法",
// 			"data": null
// 		})
// 		// #endif
// 	})
// }

/**
 * 解码电话号码
 * @param {String} phoneNumberCode   
 */
// const decodePhoneNumber = (phoneNumberCode) => {
// 	return new Promise(async resolve => {
// 		let tokenRes = await requestAccessToken(APP_ID, APP_SECRET)
// 		if (tokenRes.code === 1) {
// 			resolve(decodePhoneNumberCode(tokenRes.data, phoneNumberCode))
// 		} else {
// 			resolve(tokenRes)
// 		}
// 	})
// }


export default {
	// MODE_RESULT_AUTH_CODE,
	// MODE_RESULT_OPEN_ID,
	// authByMode,
	requestAuthCode,
	requestUserProFile
	// decodePhoneNumber
}
