const keys = {
	token: 'token',
	refreshToken: 'refreshToken',
	phone: 'phone',
	nickName: 'nickName',
	name: 'name',
	sex: 'sex',
	avatar: 'avatar',
	dept: 'dept',
	station: 'station',
	account: 'account',
	authority: 'authority',
}

/* 获取token */
const getToken = () => {
	return uni.getStorageSync(keys.token)
}

/* 保存token */
const setToken = (token) => {
	return uni.setStorageSync(keys.token, token)
}

/* 清除token */
const removeToken = () => {
	return uni.removeStorageSync(keys.token)
}

/* 获取refreshToken */
const getRefreshToken = () => {
	return uni.getStorageSync(keys.refreshToken)
}

/* 保存refreshToken */
const setRefreshToken = (refreshToken) => {
	return uni.setStorageSync(keys.refreshToken, refreshToken)
}

/* 清除refreshToken */
const removeRefreshToken = () => {
	return uni.removeStorageSync(keys.refreshToken)
}

/* 获取phone */
const getPhone = () => {
	return uni.getStorageSync(keys.phone)
}

/* 保存phone */
const setPhone = (phone) => {
	return uni.setStorageSync(keys.phone, phone)
}

/* 清除phone */
const removePhone = () => {
	return uni.removeStorageSync(keys.phone)
}

/* 获取昵称 */
const getNickName = () => {
	return uni.getStorageSync(keys.nickName)
}

/* 保存昵称 */
const setNickName = (nickName) => {
	return uni.setStorageSync(keys.nickName, nickName)
}

/* 清除昵称 */
const removeNickName = () => {
	return uni.removeStorageSync(keys.nickName)
}


/* 获取name */
const getName = () => {
	return uni.getStorageSync(keys.name)
}

/* 保存name */
const setName = (name) => {
	return uni.setStorageSync(keys.name, name)
}

/* 清除name */
const removeName = () => {
	return uni.removeStorageSync(keys.name)
}


/* 获取性别 */ 
const getSex = () => {
	return uni.getStorageSync(keys.sex)
}
/* 保存性别 */ 
const setSex = (sex) => {
	return uni.setStorageSync(keys.sex, sex)
}
/* 清除性别 */ 
const removeSex = () => {
	return uni.removeStorageSync(keys.sex)
}

/* 获取头像 */
const getAvatar = () => {
	return uni.getStorageSync(keys.avatar)
}
/* 保存头像 */
const setAvatar = (avatar) => {
	return uni.setStorageSync(keys.avatar, avatar)
}
/* 清除头像 */ 
const removeAvatar = () => {
	return uni.removeStorageSync(keys.avatar)
}

/* 获取部门 */
const getDept = () => {
	let deptStr = uni.getStorageSync(keys.dept)
	if (deptStr == null) {
		return null
	}
	return JSON.parse(deptStr)
}
/* 保存部门 */
const setDept = (dept) => {
	let deptStr = null
	if (dept != null) {
		deptStr = JSON.stringify(dept)
	}
	return uni.setStorageSync(keys.dept, deptStr)
}
/* 清除部门 */ 
const removeDept = () => {
	return uni.removeStorageSync(keys.dept)
}

/* 获取归属驻点 */
const getStation = () => {
	let stationStr = uni.getStorageSync(keys.station)
	if (stationStr == null) {
		return null
	}
	return JSON.parse(stationStr)
}
/* 归属驻点 */
const setStation = (station) => {
	let stationStr = null
	if (station != null) {
		stationStr = JSON.stringify(station)
	}
	return uni.setStorageSync(keys.station, stationStr)
}
/* 归属驻点 */ 
const removeStation = () => {
	return uni.removeStorageSync(keys.station)
}


/* 获取account */
const getAccount = () => {
	return uni.getStorageSync(keys.account)
}

/* 保存account */
const setAccount = (account) => {
	return uni.setStorageSync(keys.account, account)
}

/* 清除account */
const removeAccount = () => {
	return uni.removeStorageSync(keys.account)
}

/**
 * 获取权限
 */
const getAuthority = () => {
	return JSON.parse(uni.getStorageSync(keys.authority) || '{}')
}

const removeAuthority = () => {
	return uni.removeStorageSync(keys.authority)
}

const setAuthority = (authority) => {
	return uni.setStorageSync(keys.authority, JSON.stringify(authority || {}))
}

/**
 * 清空登录数据
 */
const removeLoginInfo = () => {
	console.log("清除登录信息")
	removeNickName()
	removeAuthority()
	removeAccount()
	removeName()
	removeSex()
	removeAvatar()
	removeDept()
	removeStation()
	removePhone()
	removeToken()
	removeRefreshToken()
}

/**
 * 保存登录数据
 */
const saveLoginInfo = (data) => {
	removeLoginInfo()
	console.log("保存登录信息", data)
	let { token, dept, name, phone, sex, refreshToken, station, icon } = data
	setToken(token)
	setRefreshToken(refreshToken)
	setDept(dept)
	setName(name)
	setPhone(phone)
	setStation(station)
	setAvatar(icon)
	setSex(sex)
}

export default {
	removeLoginInfo,
	saveLoginInfo,
	getToken,
	setToken,
	getAuthority,
	getAccount,
	getStation,
	getDept,
	getAvatar,
	getSex,
	getName,
	getNickName,
	getPhone,
	getRefreshToken,
	setRefreshToken
}
