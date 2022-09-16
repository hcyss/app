<template>
	<view id="bottomBar" class="bottom-bar-container">
		<u-tabbar
			:value="selectTabIndex"
			@change="onChangeTab"
			:fixed="false"
			placeholder
			safeAreaInsetBottom>
			<u-tabbar-item 
				v-for="(tab, index) in tabs" :key="index" 
				:text="tab.name" :icon="tab.icon"
				:dot="nvParams.notify === notifyDot? tab.count != null:false"
				:badge="nvParams.notify === notifyBadge?tab.count : null"
			/>
		</u-tabbar>
	</view>
</template>

<script>
	import { colorPrimary } from "@/uni.scss"
	const notifyDot = 'dot'
	const notifyBadge = 'badge'
	export default {
		name: 'NavBar',
		props: {
			params: {
				type: Object,
				default: () => {return {}}
			},
			tabs: { // tab数据 { id, name, url, icon, callback }
				type: Array,
				default: () => []
			},
		},
		watch: {
			params: {
				handler(nv) {
					this.nvParams = Object.assign(this.defParams, nv)
					this.selectTabIndex = this.nvParams.selectTabIndex
				},
				deep: true,
				immediate:true
			}
		},
		onLoad() {},
		data() {
			return {
				value: null, // 选中值
				notifyDot,
				notifyBadge,
				defParams: {
					notify: notifyDot, // 通知形式 显示红点或显示具体值
					badgeStyle: null, // 控制徽标的位置，对象或者字符串形式，可以设置top和right属性
					selectTabName: null, // 选中tab的名称
				},
				nvParams: {}, 
				selectTabIndex: 0,
			}
		},
		methods: {
			onChangeTab(tabIndex) {
				let tab = this.tabs[tabIndex]
				this.selectTabIndex = tabIndex
				this.$emit("changeTab", tabIndex, tab)
			}
		},
		created() {},
		mounted() {}
	}
</script>

<style lang="scss">
.bottom-bar-container {
	width: 100VW;
	z-index: 100;
}
.slot-style {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>