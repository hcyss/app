<template>
	<view class="container">
		<u-transition show mode="fade">
		<view class="page">
			<nav-bar ref="navbar" :params="navbarParams"></nav-bar>
			<view class="content">
				<u-transition show mode="fade">
					<tab-page-home v-if="curTabId === tabHomeId"></tab-page-home>
					<tab-page-elevator v-else-if="curTabId === tabElevatorId"></tab-page-elevator>
					<tab-page-message v-else-if="curTabId === tabMsgId"></tab-page-message>
					<tab-page-mine v-else-if="curTabId === tabMineId"></tab-page-mine>
					<tab-page-demo v-else-if="curTabId === tabDemoId"></tab-page-demo>
				</u-transition>
			</view>
			<bottom-bar ref="bottombar" :params="bottomBarParams" :tabs="tabs" @changeTab="onClickTab"></bottom-bar>
		</view>
		</u-transition>
		<common-widget ref="commonWidget" :visable="pageVisable"></common-widget>
	</view>
</template>

<script>
	import NavBar from '@/data-package/components/nav-bar.vue' // 导航栏
	import BottomBar from '@/data-package/components/bottom-bar.vue' // 底部栏
	import CommonWidget from '@/data-package/components/common-widget.vue' // 封装了 对话框，提示，加载动画等通用组件
	import commonPage from '@/data-package/mixins/common-page.js' // 配合通用组件的混入文件
	import TabPageHome  from '@/data-package/pages/home/tab-page-home.vue' // 首页内容
	import TabPageElevator from '@/data-package/pages/home/tab-page-elevator.vue' // 电梯页内容
	import TabPageMessage from '@/data-package/pages/home/tab-page-message.vue' // 消息页内容
	import TabPageMine from '@/data-package/pages/home/tab-page-mine.vue' // 我的页内容
	import TabPageDemo from '@/data-package/pages/home/tab-page-demo.vue' // 演示内容
	const tabHomeId = 1
	const tabElevatorId = 2
	const tabMsgId = 3
	const tabMineId = 4
	const tabDemoId = 5
	export default {
		components: {NavBar, BottomBar, CommonWidget, TabPageHome, TabPageElevator, TabPageMessage, TabPageMine, TabPageDemo},
		mixins:[commonPage],
		data() {
			return {
				navbarParams: {
					title: '演示'
				},
				bottomBarParams: {
					selectTabIndex: 4,
					notify:'badge',
				},
				curTabId: tabDemoId,
				tabHomeId,
				tabElevatorId,
				tabMsgId,
				tabMineId,
				tabDemoId,
				tabs: [
					{
						id: tabHomeId, name: '首页', icon:"home", count: null
					},
					{
						id: tabElevatorId, name: '电梯', icon:"grid", count: null
					},
					{
						id: tabMsgId, name: '消息', icon:"email", count: null
					},
					{
						id: tabMineId, name: '我的', icon:"account", count: null
					},
					{
						id: tabDemoId, name: '演示', icon:"setting", count: 99
					}
				],
			}
		},
		methods: {
			onClickTab(index, tab) {
				this.navbarParams.title = tab.name
				this.curTabId = tab.id
			},
			syncContentPosition() {
				// this.$nextTick(() => {
					this.getPageContentPosition(this.$refs.navbar, this.$refs.bottombar, (data) => {
						this.$setContentPosition(data)
					})
				// })
			}
		},
		mounted() {
			this.syncContentPosition()
		}
	}
</script>

<style lang="scss">
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
</style>
