import ebEvent from "./event.js"

/**
 * 判断请求是否成功
 * @param {Object} res 返回对象 
 */
export const isResSuccess = (res) => {
	return res != null && (
		(res.data != null && (res.data.code === 200 || res.data.code === 1)) ||
		(res.code === 200 || res.code === 1)
	)
}
/**
 * 返回一个指定小数点后几位的浮点数
 * @param {Number} number 浮点数
 * @param {Number} digit 保留小数点后几位
 * @returns 
 */
export const toFixed = (number, digit) => {
  const fixNum = Math.pow(10, digit)
  const result = Math.floor(number * fixNum) / fixNum
  return result
}
/**
 * 判断是否使用静态数据
 */
export const isUseTestData = () => {
	return uni.getStorageSync("useTestData")
}
/**
 * 设置使用静态数据
 */
export const useTestData = (useTestData = true) => {
	uni.setStorageSync("useTestData", useTestData)
}

/**
 * 保存内容区域的top和bottom
 */
export const setContentPosition = ({top, bottom} = data) => {
	if (isEmpty(top) || isEmpty(bottom)) return
	console.log(`set top = ${top}, bottom = ${bottom}`)
	uni.setStorageSync("contentPosition", JSON.stringify({top, bottom}))
}

/**
 * 获取内容区域的top和bottom
 */
export const getContentPosition = () => {
	let data = uni.getStorageSync("contentPosition")
	console.log(`get ${data}`)
	return JSON.parse(isEmpty(data)? "{top: 40px, bottom: 50px;}" : data) 
}

/**
 * 根据图片链接返回base64编码
 */
export const getImgBase64 = (url, callback) => {
	let Img = new Image(),
		dataURL = '';
	Img.src = url + '?v=' + Math.random();
	Img.setAttribute('crossOrigin', 'Anonymous');
	Img.onload = () => {
		let canvas = document.createElement('canvas'),
			width = Img.width,
			height = Img.height;
		canvas.width = width;
		canvas.height = height;
		canvas.getContext('2d').drawImage(Img, 0, 0, width, height);
		dataURL = canvas.toDataURL('image/jpeg');
		return callback ? callback(dataURL) : null;
	};
}
/**
 * 显示提示信息
 * @param {Object} data
 * data = { top: 0, type: 'success', message: '', duration: 3000, fontSize: 20, safeAreaInsetTop: true }
 */
export const showTips = data => uni.$emit(ebEvent.SHOW_TIPS, data)
/**
 * 显示对话框
 * @param {Object} data
 * data = { title: '提示', content: '', confirm: () => {}, confirmText: '确认', cancel: () => {}, cancelText: '取消', showCancelButton: false, closeOnClickOverlay: false }
 */
export const showDialog = data => uni.$emit(ebEvent.SHOW_DIALOG, data)
/**
 * 显示加载遮罩
 * @param {Object} data
 * data = {text: '', color: '#007aff' }
 */
export const showLoading = data => uni.$emit(ebEvent.SHOW_LOADING, data)
/**
 * 关闭加载遮罩
 */
export const hideLoading = () => uni.$emit(ebEvent.HIDE_LOADING)

/**
 * 显示吐司
 * @param {Object} data
 * data = { type: 'default', message: '', icon: '', position: 'bottom', params: null, duration: 2000, complete: ()=> {} }
 */
export const showToast = (data) => uni.$emit(ebEvent.SHOW_TOAST, data)

/**
 * 是否非空
 * @param {Object} obj
 */
export const notEmpty = (obj) => {
	return !isEmpty(obj);
}

/**
 * 是否空
 * @param {Object} obj
 */
export const isEmpty = (obj) => {
	if (Object.prototype.toString.call(obj) == '[object Null]' || Object.prototype.toString.call(obj) ==
		"[object Undefined]") {
		return true;
	} else
	if (Object.prototype.toString.call(obj) == '[object Object]') {
		if (obj != null && JSON.stringify(obj) != '{}') {
			return false;
		}
	} else
	if (Object.prototype.toString.call(obj) == '[object Array]') {
		if (obj != null && obj.length > 0) {
			return false;
		}
	} else
	if (Object.prototype.toString.call(obj) == '[object String]') {
		if (obj != null && obj.trim().length > 0) {
			return false;
		}
	} else if (Object.prototype.toString.call(obj) == '[object Number]' ||
		Object.prototype.toString.call(obj) == '[object Boolean]' ||
		Object.prototype.toString.call(obj) == '[object Function]') {
		return false;
	} else if (Object.prototype.toString.call(obj) == '[object Set]' || Object.prototype.toString.call(obj) ==
		'[object Map]' && obj.size != 0) {
		return false;
	} else if (JSON.stringify(obj) !== {}) {
		return false;
	}
	return true;
}
