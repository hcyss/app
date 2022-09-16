// 基址
// #ifdef H5
const baseUrl = '/api'
// #endif
// #ifdef MP-WEIXIN
const baseUrl = 'https://www.wanandroid.com'
// #endif


/**
 * 获取基链
 */
const getBaseUrl = () => {
	const isProduct = process.env.NODE_ENV === 'production'
	let host =  uni.getStorageSync('apiHost')
	if (host == null || host.trim().length == 0) {
		host = baseUrl
	}
	return `${host}/`
}

const urlMapping = {
	/**
	 * 1. 微信code 换取 token
	 */
	GET_TOKEN:"/miniapp/system/getToken",
	
	/**
	 * 2. 登录
	 */
	LOGIN: "/LOGIN",
	
	// /**
	//  * 2. 申请答题
	//  */
	// REQUEST_QUESTION:"/article/list/0/json",
	// /**
	//  * 3. 提交答案
	//  */
	// SUBMIT_ANSWER:"/miniapp/topic/commitSolution",
	// /**
	//  * 4. 排行榜
	//  */
	// RANKING_LIST:"/miniapp/system/rankinglist",
	// /**
	//  * 5. 获取学校列表
	//  */
	// LOAD_SCHOOL:"/miniapp/system/getSchoolList",
	// /**
	//  * 6. 获取班级列表
	//  */
	// LOAD_CLASS:"/miniapp/system/getClassList",
	// /**
	//  * 7. 绑定用户信息
	//  */
	// BIND_USER_INFO:"/miniapp/system/commitPersonalData",
	// /**
	//  * 8. 查询个人资料
	//  */
	// LOAD_USER_INFO:"/miniapp/system/personalData",
	// /**
	//  * 9. 获取游戏规则
	//  */
	// ABOUT_RULE_INFO:"/miniapp/system/getGameRule",
	// /**
	//  * 10. 获取绑定说明
	//  */
	// ABOUT_BIND_INFO:"/miniapp/system/getBindingInstructions",
	// /**
	//  * 11. 解析电话号码
	//  */
	// DECODE_PHONE_NUMBER:"/miniapp/system/getUserPhone",
	// /**
	//  * 12. 获取学校等级
	//  */
	// LOAD_SCHOOL_LEVELS:"/miniapp/system/getSchoolGradeList"
}

/**
 * 读取鉴权白名单链接
 */
const loadWhiteList = () => {
	return [
		urlMapping.GET_TOKEN
	]
}


export default  {
	loadWhiteList,
	getBaseUrl,
	...urlMapping
};
