<template>
	<view class="container">
		<view class="page">
			<!-- 演示 -->
			<u-button type="success" @click="navPage('/data-package/pages/demo/notify')">全局dialog、tips、loading，toast</u-button>
			<u-button type="success" @click="navPage('/data-package/pages/demo/list')">列表（上拉加载、下拉刷新）</u-button>
			<u-button type="success" @click="navPage('/data-package/pages/demo/list-slot')">列表组件（上拉加载、下拉刷新）+ 插槽</u-button>
			<u-button type="success" @click="navPage('/data-package/pages/demo/details')">详情（编辑、只读）与 CommonWidget的交互及输入</u-button>
			<u-button type="success" @click="callPageCommonWidget">调用page的CommonWidget组件api</u-button>
		</view>
	</view>
</template>

<script>
	import commonPage from '@/data-package/mixins/common-page.js'
	export default {
		name: 'TabPageDemo',
		components: {},
		mixins:[commonPage],
		data() {
			return {
				
			}
		},
		methods: {
			navPage(url){
				uni.navigateTo({
					url
				})
			},
			callPageCommonWidget() {
				this.$getPageCommonWidget().showActionSheet({
					list: [
						{"code": 1, "name": 'Android'},
						{"code": 2, "name": 'iOS'},
						{"code": 3, "name": 'uniapp'}
					],
					selectMethod: (data) => { console.log(data) } // 选中的回调
				})
			}
		},
		mounted() {}
	}
</script>

<style lang="scss">
.container {
	width: 100%;
	height: 100%;
	position: relative;
	background-color: lightcoral;
}
.page {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	// align-items: center;
	// justify-content: center;
	
}
</style>
