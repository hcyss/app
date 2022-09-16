<template>
	<view class="container">
		<u-transition show mode="fade">
			<view class="page">
				<nav-bar id="navbar" ref="navbar" :params="navbarParams" @rightClick="onShowSearchPanel"></nav-bar>
				<view class="content">
					<!-- list-view 组件，不需要给它提供列表数据，自身内部会维护列表数据，触发query回调时候，把请求回来的数据，通过callback.complete回调给list-view组件即可。 -->
					<list-view ref="listview" useLoadMore :showSearch="isShowSearch" :topOffset="topOffset" :bottomOffset="bottomOffset" :pageSize="pageSize"  @query="query" @checkChanged="onCheckChanged">
						<template #search>
							<!-- 搜索面板的插槽 -->
							<view class="search-panel">
								<details-item ref="start" item-key="start" title="开始日期" :itemValue="searchParams.start" :valueFormat="dateFormat" edit bottomLine iconColor="#aaa" iconSize="40rpx" icon="arrow-right" @click="onSelectDate"></details-item>
								<details-item ref="end" item-key="end" title="结束日期" :itemValue="searchParams.end" :valueFormat="dateFormat" edit bottomLine iconColor="#aaa" iconSize="40rpx" icon="arrow-right" @click="onSelectDate"></details-item>
								<view class="search-item">
									<view style="flex: 1;">
										<u-input placeholder="请输入搜索内容"></u-input>
									</view>
									<view>
										<u-icon name="search" size="40" @click="onSearch"></u-icon>
									</view>
								</view>
							</view>
						</template>
						<template  #list="{data, updateSelectCallback}">
							<!-- 列表的插槽 -->
							<!-- 
							list-item 这个组件，除了左右两边的icon，中间是一个九宫格的内容区域
							参数开头的命名规则：
							 lt(左上)，ct(中上)，rt(右上)
							 lc(左中)，cc(中中)，rc(右中)
							 lb(左下)，cb(中下)，rb(右下)
							如果需要某个区域隐藏，则不给值，或给null，或给空字符串。隐藏后的区域空间会被其它可见区域平分。
							如果需要某个区域占位，则给空格。
							 -->
							<list-item class="item" v-for="(item, index) in data" :key="index"
								:index="index"
								:item="item"
								:avatarSrc="item.icon"
								leftIconSize="100rpx"
								:ltTxt="item.title"
								:rtTxt="item.statusName"
								:rtColor="item.status === 1?'red':'green'"
								lbTxt=" "
								:rbTxt="item.time"
								bgColor="yellow"
								topLine
								:bottomLine="list.length - 1 === index"
								useCheck
								:updateSelectCallback="updateSelectCallback"
								@check="onCheckItem"
								@click="onClickItem"
								@clickRightIcon="onClickRightIcon"
								></list-item>
						</template>
					</list-view>
				</view>
			</view>
		</u-transition>
		<common-widget ref="commonWidget" :visable="pageVisable"></common-widget>
	</view>
</template>


<script>
	import NavBar from '@/data-package/components/nav-bar.vue' // 导航栏
	import CommonWidget from '@/data-package/components/common-widget.vue' // 封装了 对话框，提示，加载动画等通用组件
	import ListView from '@/data-package/components/list-view.vue' // 列表组件
	import commonPage from '@/data-package/mixins/common-page.js'
	import DetailsItem from '@/data-package/components/details-item.vue'
	import ListItem from "@/data-package/components/list-item.vue"
	export default {
		name: 'ListDemo',
		components: {
			NavBar,
			CommonWidget,
			ListView,
			ListItem,
			DetailsItem
		},
		mixins: [commonPage],
		data() {
			return {
				navbarParams: {
					title: '列表演示',
					rightIcon: "search",
				},
				topOffset: 0, // listview的顶部偏移量，单位：px
				bottomOffset: 0, // listview的底部偏移量，单位：px
				isShowSearch: false, // 是否显示搜索面板
				pageSize: 15, // 每页显示记录数，不提供则默认为每页10条
				searchParams: { // 搜索参数
					start: null, // 开始日期
					end: null, // 结束日期
				},
				list: [], // 数据列表，假数据用，正常情况，删除掉即可，不需要这个变量的
			}
		},
		methods: {
			onClickRightIcon() {
				console.log("onClickRightIcon")
			},
			onCheckItem(index, item, checked) {
				console.log("onCheckItem", index, item, checked)
			},
			onClickItem(index, item) {
				console.log("onClickItem", index, item)
			},
			onCheckChanged(dataList, selectIds) {
				console.log("选中的id = ", JSON.stringify(selectIds))
			},
			dateFormat(timeStamp) {
				return this.$dayjs(timeStamp).format("YYYY-MM-DD")
			},
			onSelectDate(data) {
				this.$refs.commonWidget.showDate({
					data, // 展示的数据，注意：data.value 必须是时间戳，请传入前做好转换
					min: this.$dayjs().subtract(100, 'year').valueOf(),  // 日期可选的的下限（时间戳）
					max: this.$dayjs().valueOf(), // 日期可选的上限（时间戳）
					popupSelectMethod: (data) => { // 选中后的回调
						if (data.key === 'start') {
							data.value = this.getStartTime(data.value)
						} else 
						if (data.key === 'end') {
							data.value = this.getEndTime(data.value)
						}
						this.searchParams[data.key] = data.value
					}
				})
			},
			onSearch() {
				this.$refs.listview.search() // 发起list-view的搜索
			},
			onShowSearchPanel() {
				this.isShowSearch = !this.isShowSearch
			},
			syncListViewPosition() {
				// 获取列表的顶部位置和底部位置，不会被遮掩
				this.$nextTick(() => {
					this.getPageContentPosition(this.$refs.navbar, null, (data) => {
						console.log(data);
						let {
							top,
							bottom
						} = data
						this.topOffset = top
						this.bottomOffset = bottom
					})
				})
			},
			/**
			 * list-view 的 列表查询的请求回调
			 * @param {Number} pageNo 获取数据的页码
			 * @param {Number} pageSize 每页显示的数据量
			 * @param {Function} callback.complete 请求成功的回调，入参是列表数据
			 * @param {Function} callback.err 请求失败的回调，无参
			 */
			query(pageNo, pageSize, {
				complete,
				err
			} = callback) {
				this.apiMethod(pageNo, pageSize, this.searchParams).then(res => {
					if(this.$isSuccess(res)) {
						complete(res.data || []) // 告知list-view，数据返回了
					}
				}).catch(e => {
					err() // 告知list-view，请求发生出错
				})
			},
			getMockData(isRefresh) {
				// 生成假数据
				let arr = []
				if (isRefresh) {
					// this.onlyRefresh = true // 触发第一次取数据后，就设置为true，就无法使用上拉加载更多。如果需要上拉加载更多就注释掉。
					for (let i = 0; i < this.pageSize; i++) {
						let index = i + 1
						arr.push({
							id: index,
							title: `订单条目 ${index}`,
							icon: 'https://img1.baidu.com/it/u=1794322298,855709156&fm=253&fmt=auto&app=138&f=JPEG',
							status: index%2,
							statusName: index%2 === 0?'完成':'处理中',
							time: this.$dayjs().subtract(index, 'hour').format('YYYY-MM-DD HH:mm:ss')
						})
					}
				} else {
					for (let i = 0; i < this.pageSize; i++) {
						let index = this.list.length + i + 1
						arr.push({
							id: index,
							title: `订单条目 ${index}`,
							icon: 'https://img1.baidu.com/it/u=1794322298,855709156&fm=253&fmt=auto&app=138&f=JPEG',
							status: index%2,
							statusName: index%2 === 0?'完成':'处理中',
							time: this.$dayjs().subtract(index, 'hour').format('YYYY-MM-DD HH:mm:ss')
						})
					}
				}
				return arr
			},
			apiMethod(pageNo, pageSize, params) {
				// 模仿请求
				return new Promise((resolve, reject) => {
					try {
						this.showLoading()
						setTimeout(() => {
							let data = []
							if (pageNo === 1) {
								data = this.getMockData(true)
								this.list = data
							} else 
							if (pageNo <= 3) {
								data = this.getMockData()
								this.list = this.list.concat(data)
							}
							resolve({
								code: 1,
								data,
								message: '成功'
							}) 
							this.hideLoading()
						}, 2000)
					} catch (err) {
						reject(reject.message)
					}
				})
			},
		},
		created() {
			this.searchParams.start = this.getStartTime(this.$dayjs().subtract(1, 'month'))
			this.searchParams.end = this.getEndTime(this.$dayjs())
		},
		mounted() {
			this.syncListViewPosition()
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		height: 100vh;
	}

	.page {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.content {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.search-bar {
		display: flex;
	}
	.search-panel {
		display: flex;
		flex-direction: column;
		.search-item {
			display: flex;
			padding: 10px;
			align-items: center;
			border-bottom: 1px solid #999;
		}
	}
	
</style>
