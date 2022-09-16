<template>
	<view class="list-view-container">
		<z-paging id="paging" ref='paging' :paging-style="listViewStyle" :default-page-size="pageSize" v-model="dataList" @query="query" :loading-more-enabled="mUseLoadMore">
			<view slot='top' class="search-bar">
				<u-transition :show="showSearch" mode="fade-down">
				<slot name="search"></slot>
				</u-transition>
			</view>
			<!-- 不要做成v-for 包裹solt的模式，会有bug，直接把list做成solt，也就是solt里外部实现v-for -->
			<!-- <view class="item" v-for="(data, index) in dataList" :key="index">
				<slot name="list-item" :data="{data, index}"></slot>
			</view> -->
			
			<!-- dataList 是列表数据；updateSelectCallback 则是在选中发生变化时候，返回序号和选中状态，由父组件维护列表数据的状态变化 -->
			<slot name="list" :data="dataList" :updateSelectCallback="updateSelectCallback"></slot>
		</z-paging>
	</view>
</template>

<script>
	/**
	 * z-paging 分页组件
	 * @description 高性能，全平台兼容。支持虚拟列表，支持nvue、vue3
	 * @tutorial https://z-paging.zxlee.cn
	 * @notice 以下仅为部分常用属性、方法&事件，完整文档请查阅z-paging官网
	 * @property {Number|String} default-page-no 自定义初始的pageNo，默认为1
	 * @property {Number|String} default-page-size 自定义pageSize，默认为10
	 * @property {String} language i18n国际化设置语言，支持简体中文(zh-cn)、繁体中文(zh-hant-cn)和英文(en)
	 * @property {Object} paging-style 设置z-paging的style，部分平台(如微信小程序)无法直接修改组件的style，可使用此属性代替
	 * @property {String} height z-paging的高度，优先级低于pagingStyle中设置的height，传字符串，如100px、100rpx、100%
	 * @property {String} width z-paging的宽度，优先级低于pagingStyle中设置的width，传字符串，如100px、100rpx、100%
	 * @property {String} bg-color z-paging的背景色，优先级低于pagingStyle中设置的background。传字符串，如"#ffffff"
	 * @property {Boolean} refresher-only 是否只使用下拉刷新，设置为true后将关闭mounted自动请求数据、关闭滚动到底部加载更多，强制隐藏空数据图。默认为否
	 * @property {Boolean} use-page-scroll 使用页面滚动，默认为否，当设置为是时则使用页面的滚动而非此组件内部的scroll-view的滚动，使用页面滚动时z-paging无需设置确定的高度且对于长列表展示性能更高，但配置会略微繁琐
	 * @property {Boolean} use-virtual-list 是否使用虚拟列表，默认为否
	 * @property {Boolean} fixed z-paging是否使用fixed布局，若使用fixed布局，则z-paging的父view无需固定高度，z-paging高度默认为100%，默认为是(当使用内置scroll-view滚动时有效)
	 * @property {Boolean} safe-area-inset-bottom 是否开启底部安全区域适配，默认为否
	 * @property {Boolean} auto [z-paging]mounted后是否自动调用reload方法(mounted后自动调用接口)，默认为是
	 * @property {Boolean} auto-scroll-to-top-when-reload reload时是否自动滚动到顶部，默认为是
	 * @property {Boolean} auto-clean-list-when-reload reload时是否立即自动清空原list，默认为是，若立即自动清空，则在reload之后、请求回调之前页面是空白的
	 * @property {Boolean} show-refresher-when-reload 列表刷新时是否自动显示下拉刷新view，默认为否
	 * @property {Object} loading-more-custom-style 自定义底部加载更多样式
	 * @property {Boolean} loading-more-enabled 是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据)，默认为是
	 * @property {Boolean} inside-more 当分页未满一屏时，是否自动加载更多(nvue无效)，默认为否
	 * @property {Boolean} hide-empty-view 是否强制隐藏空数据图，默认为否
	 * @property {String|Object} empty-view-text 空数据图描述文字，默认为“没有数据哦~”
	 * @property {Boolean} show-empty-view-reload 是否显示空数据图重新加载按钮(无数据时)，默认为否
	 * @property {Boolean} show-empty-view-reload-when-error 加载失败时是否显示空数据图重新加载按钮，默认为是
	 * @property {String} empty-view-img 空数据图图片，默认使用z-paging内置的图片
	 * @property {Object} empty-view-style 空数据图样式
	 * @property {Boolean} auto-show-back-to-top 自动显示点击返回顶部按钮，默认为否
	 * @property {Boolean} show-scrollbar 控制是否出现滚动条，默认为是
	 * @property {Boolean} refresher-enabled 是否开启自定义下拉刷新，默认为是
	 * @property {Boolean} show-refresher-update-time 是否显示上次下拉刷新更新时间，默认为否
	 * @property {Boolean} use-chat-record-mode 使用聊天记录模式，默认为否
	 * @property {String} nvue-list-is nvue中修改列表类型，可选值有list、waterfall和scroller，默认为list
	 * @property {Object} nvue-waterfall-config nvue waterfall配置，仅在nvue中且nvueListIs=waterfall时有效，配置参数详情参见：https://uniapp.dcloud.io/component/waterfall
	 * @event {Function} query 下拉刷新或滚动到底部时会自动触发此方法。z-paging加载时也会触发(若要禁止，请设置:auto="false")。pageNo和pageSize会自动计算好，直接传给服务器即可。
	 * @event {Function} refresherStatusChange 自定义下拉刷新状态改变(use-custom-refresher为true时生效)
	 * @event {Function} loadingStatusChange 上拉加载更多状态改变
	 * @event {Function} onRefresh 自定义下拉刷新被触发
	 * @event {Function} scroll `z-paging`内置的scroll-view滚动时触发
	 * @example <z-paging ref="paging" v-model="dataList" @query="queryList"></z-paging>
	 */ 
	import zPaging from '@/data-package/components/z-paging/z-paging.vue' // 列表组件
	var that;
	export default {
		name: 'ListView',
		components: { zPaging },
		props: {
			showSearch: {
				type:Boolean,
				default: false
			}, // 显示 搜索面板
			useLoadMore: {
				type: Boolean,
				default:true
			}, // 是否开启加载更多
			pageSize: {
				type: Number,
				default: 10
			}, // 每页10条记录
			topOffset: {
				type: Number,
				default: 0
			}, // 顶部偏移像素（单位：px，避开导航栏遮盖）
			bottomOffset: {
				type: Number,
				default: 0
			}, // 底部偏移像素（单位：px，避开底部栏遮盖）
		},
		watch: {
			useLoadMore: {
				handler(nv) {
					this.mUseLoadMore = nv
				},
				immediate: true
			},
			checkedIds(nv) {
				if(!nv || nv && nv.length === 0) {
					that.$emit('checkChanged', this.dataList, nv)
				}
			},
			topOffset: {
				handler(nv) {
					this.listViewStyle = { top: `${nv}px`, bottom: `${this.bottomOffset}px`}
				},
				immediate: true
			},
			bottomOffset: {
				handler(nv) {
					this.listViewStyle = { top: `${this.topOffset}px`, bottom: `${this.nv}px`}
				},
				immediate: true
			}
		},
		data() {
			return {
				dataList: [], // 列表数据
				listViewStyle: null, // 列表样式
				checkedIds: [], // 选中的id 
				mUseLoadMore: true, // 是否使用上拉加载更多
			}
		},
		methods: {
			updateSelectCallback(index, isChecked) {
				// 这里调用this 是list-item的this，不是list-view的this，所以要调用that，才能拿到list-view的实例
				const dataList = that.dataList
				dataList[index].isChecked = isChecked
				that.checkedIds = dataList.filter(it => it.isChecked).map(it => it.id)
				that.$emit('checkChanged', dataList, that.checkedIds)
			},
			search() {
				this.$refs.paging.reload() 
				// 常用方法
				// reload: 重新加载分页数据，pageNo恢复为默认值，相当于下拉刷新的效果。可传入参 true 或 false, 代表是否显示加载动画，默认值为false
				// refresh: 刷新列表数据，pageNo和pageSize不会重置，列表数据会重新从服务端获取。
				// complete 或 end: 请求失败时直接调用：this.$refs.paging.complete(false); 即可；如果只是想表达请求结束，则调用：this.$refs.paging.complete(); 即可
				// scrollToTop: 滚动到顶部
				// scrollToBottom: 滚动到底部
				// scrollIntoViewById: 滚动到指定view, 参数1(必填)需要滚动到的view的id值，不包含"#"；参数2(非必填):偏移量，单位为px，默认为0；参数3(非必填):是否有动画效果，默认为否
			},
			/**
			 * 请求数据失败
			 */
			requestErr() {
				this.$refs.paging.complete(false)
				this.mUseLoadMore = this.useLoadMore // 恢复是否需要加载更多的标志位
			},
			/**
			 * 请求成功
			 * @param {Array} pageDataList 当前页的数据，注意不是整个列表的数据
			 */
			requestComplete(pageDataList = []) {
				this.dataList = this.dataList.concat(pageDataList)
				this.$refs.paging.complete(pageDataList) 
				this.mUseLoadMore = this.useLoadMore // 恢复是否需要加载更多的标志位
			},
			/**
			 * 查询
			 * @param {Number} pageNo 当前页码
			 * @param {Number} pageSize 每页记录数
			 */
			query(pageNo, pageSize) {
				// console.log("pageNo = ", pageNo, ", pageSize = ", pageSize)
				if (pageNo === 1){
					this.dataList = []
					if (this.checkedIds.length > 0) {
						this.checkedIds = []
					}
					this.mUseLoadMore = false // 在数据为空时候，需要暂时隐藏加载更多的文字。不然会显示出来就不雅观了。
				} 
				let err = this.requestErr // 请求失败回调
				let complete = this.requestComplete // 请求成功回调，入参是数据列表
				this.$emit("query", pageNo, pageSize, {complete, err})
			}
		},
		created() {
			that = this
		},
		mounted() {}
	}
</script>

<style lang="scss" scoped>
	.list-view-container {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>