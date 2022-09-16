<template>
	<view class="content">
		<u-image :src="require('@/static/logo.png')" width="100" height="100" shape="circle"></u-image>
		<text class="welcome-title">欢迎使用智慧电梯</text>
	</view>
</template>
<script>
	export default {
		data() {
			return {}
		},
		onLoad() {

		},
		created() {
			this.init()
		},
		mounted() {
			
		},
		methods: {
			navPageLogin() {
				uni.reLaunch({
					url: '/data-package/pages/login/login',
				})
			},
			init() {
				setTimeout(()=> {
					// #ifdef MP-WEIXIN
						this.wxSyncToken()
					// #endif
					// #ifdef H5 || APP-PLUS
						this.navPageLogin()
					// #endif
				}, 3000)
			},
			async wxSyncToken() {
				await this.$api.getTokenByWxCode()
				this.navPageLogin()
			},
			
		}
	}
</script>

<style>
	.content {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.icon {
		width: 200rpx;
		height: 200rpx;
	}
	.welcome-title {
		margin-top: 20rpx;
	}
</style>
