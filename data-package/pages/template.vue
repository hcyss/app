<template>
	<view class="container">
		<u-transition show mode="fade">
		<view class="page">
			<navbar :params="navbarParams"></navbar>
			<view class="content">
				
			</view>
		</view>
		</u-transition>
		<common-widget ref="commonWidget" :visable="pageVisable"></common-widget>
	</view>
</template>

<script>
	import Navbar from '@/data-package/components/nav-bar.vue' // 导航栏
	import CommonWidget from '@/data-package/components/common-widget.vue' // 封装了 对话框，提示，加载动画等通用组件
	import commonPage from '@/data-package/mixins/common-page.js' // 配合通用组件的混入文件
	export default {
		components: {Navbar, CommonWidget},
		mixins:[commonPage],
		data() {
			return {
				navbarParams: {
					title: '详情演示'
				}
			}
		},
		methods: {},
		mounted() {}
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
	// align-items: center;
	// justify-content: center;
}
</style>
