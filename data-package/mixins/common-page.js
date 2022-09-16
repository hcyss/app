import ebEvent from '@/data-package/utils/event.js'
import InputType from "@/data-package/utils/input-type.js"
import time from '@/data-package/utils/time.js'
import scssStyleVals from "@/uni.scss"
/**
 * 这个混入文件用于页面，建议所有pages中的页面都混入
 */
var that
export default {
	props:{},
	watch: {},
	data() {
		return {
			pageVisable: false ,// 用于控制CommonWidget的事件总线设置监听和注销监听
			...InputType, // 输入类型
			...scssStyleVals, // scss 定义的变量
		}
	},
	filters: {
		formatTimestamp(timestamp, format = 'YYYY-MM-DD HH:mm', emptyInfo = null) {
			if(that.isEmpty(timestamp) || timestamp == 0) return (emptyInfo != null? emptyInfo:'暂无')
			return that.formatTime(timestamp, format)
		}
	},
	methods: {
		...time,
		/**
		 * 显示成功toast
		 * @param {String} message
		 * @param {Method} callback
		 */
		showSucToast(message, callback) {
			this.$showToast({ type: this.$TipsType.SUCCESS, message, complete: callback })
		},
		/**
		 * 显示出错toast
		 * @param {String} message
		 * @param {Method} callback
		 */
		showErrToast(message, callback) {
			this.$showToast({ type: this.$TipsType.ERROR, message, complete: callback })
		},
		/**
		 * 默认样式的吐司
		 * @param {String} message
		 * @param {Method} callback
		 */
		showToast(message, callback) {
			this.$showToast({ message, complete: callback })
		},
		/**
		 * 显示成功信息
		 * @param {Object} message
		 */
		showSucTips(message) {
			this.$showTips({ type: this.$TipsType.SUCCESS, message })
		},
		/**
		 * 显示出错信息
		 * @param {Object} message
		 */
		showErrTips(message) {
			this.$showTips({ type: this.$TipsType.ERROR, message })
		},
		/**
		 * 显示警告信息
		 * @param {Object} message
		 */
		showWarnTips(message) {
			this.$showTips({ type: this.$TipsType.WARN, message })
		},
		/**
		 * 显示加载
		 */
		showLoading() {
			this.$showLoading()
		},
		/**
		 * 隐藏加载
		 */
		hideLoading() {
			this.$hideLoading()
		},
		/**
		 * 显示对话框
		 * @param {Object} data
		 */
		showDialog(data) {
			// {
			// 	title, content, confirm, confirmText, cancel, cancelText, showCancelButton: false,  closeOnClickOverlay: false
			// }
			this.$showDialog(data)
		},
		/**
		 * 获取状态栏高度
		 * @param {Object} callback
		 */
		getStatusBarHeight(callback) {
			uni.getSystemInfo({
				success: (e) => {
					let statusBarHeight = 0
					statusBarHeight = e.statusBarHeight
					callback && callback(statusBarHeight)
				}
			})
		},
		/**
		 * 获取 页面内容区域的Top 和 Bottom
		 * @param {Object} ele
		 * @param {Object} callback
		 */
		getPageContentPosition(navBar, bottomBar, callback) {
			console.log("getPageContentPosition")
			let navBarRect = null
			let bottomBarRect = null
			let promiseArr = []
			if (navBar) {
				// '{"x":195.1999969482422,"y":0,"width":0,"height":44,"top":0,"right":195.1999969482422,"bottom":44,"left":195.1999969482422}'
				promiseArr.push(new Promise(resolve => {
					// #ifdef MP-WEIXIN
						uni.createSelectorQuery().in(navBar).select('#navBar').boundingClientRect(rect => {
							// console.log("nav-bar complete = ", rect)
							navBarRect = rect
							resolve()
						}).exec()
					// #endif
					// #ifndef MP-WEIXIN
						navBarRect = navBar.$el.getBoundingClientRect()
						resolve()
					// #endif
				}).catch(err => console.log(err)))
			} 
			if (bottomBar) {
				// '{"x":39.20000076293945,"y":793.2000122070312,"width":312,"height":50.79999923706055,"top":793.2000122070312,"right":351.20000076293945,"bottom":844.0000114440918,"left":39.20000076293945}'
				promiseArr.push(new Promise(resolve => {
					// #ifdef MP-WEIXIN
					uni.createSelectorQuery().in(bottomBar).select('#bottomBar').boundingClientRect(rect => {
						// console.log("bottom-bar complete = ", rect)
						bottomBarRect = rect
						resolve()
					}).exec()
					// #endif
					// #ifndef MP-WEIXIN
						bottomBarRect = bottomBar.$el.getBoundingClientRect()
						resolve()
					// #endif
				}).catch(err => console.log(err)))
			}
			Promise.all(promiseArr).then(res => {
				uni.getSystemInfo({
					success: (e) => {
						// console.log("getSystemInfo", e)
						let statusBarHeight = e.statusBarHeight
						let screenHeight = e.screenHeight
						let safeBottom = e.safeArea.bottom
						let navBarHeight = navBarRect? navBarRect.height : 0
						// #ifdef MP-WEIXIN
						let top = navBarHeight // 内容区域距离屏幕顶部的距离
						// #endif
						// #ifndef MP-WEIXIN
						let top = statusBarHeight + navBarHeight // 内容区域距离屏幕顶部的距离
						// #endif
						let bottom = bottomBarRect? screenHeight - bottomBarRect.top : screenHeight - safeBottom // 内容区域距离屏幕底部的距离
						callback && callback({top: Math.round(top * 10) / 10, bottom: Math.round(bottom * 10) / 10})
					}
				})
			}).catch(err => console.log(err))
		},
		/**
		 * 是否非空
		 * @param {Object} obj
		 */
		notEmpty (obj) {
		  return !this.isEmpty(obj);
		},
		/**
		 * 是否空
		 * @param {Object} obj
		 */
		isEmpty (obj) {
		  return this.$isEmpty(obj);
		}
	},
	onLoad() {
		that = this
	},
	created() {
	},
	onShow() {
		// console.log("page-onShow")
		this.pageVisable = true // 页面显示注册当前页面的eventbus监听
	},
	onHide() {
		// console.log("page-onHide")
		this.pageVisable = false // 页面隐藏注销当前页面的eventbus监听
	}
}
