import time from '@/data-package/utils/time.js'
import scssStyleVals from "@/uni.scss"
var that
export default {
	data() {
		return {
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
	}
}
