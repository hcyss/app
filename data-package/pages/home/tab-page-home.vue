<template>
	<view class="container">
		<view class="page">
			首页
		</view>
	</view>
</template>

<script>
	import commonPage from '@/data-package/mixins/common-page.js'
	export default {
		name: 'TabPageHome',
		components: {},
		mixins:[commonPage],
		data() {
			return {}
		},
		methods: {},
		mounted() {}
	}
</script>

<style lang="scss">
.container {
	width: 100%;
	height: 100%;
	position: relative;
	background-color: aqua;
}
.page {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	
}
</style>
