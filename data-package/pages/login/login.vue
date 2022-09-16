<template>
	<view class="container">
		<u-transition :show="showContainer" mode="fade">
		<view class="content">
			<view class="fill-view"></view>
			<u-image :src="require('@/static/logo.png')" width="200rpx" height="200rpx" shape="circle"></u-image>
			<view class="app-title-wrapper">
				<text class="app-title">智慧电梯系统</text>
			</view>
			<view v-if="!isAutoLogin">
				<view class="input-group">
					<view class="input-item">
						<u-input placeholderClass="placeholder-style" fontSize="32rpx" maxlength="16" placeholder="请填写企业号" clearable v-model="tenantId">
							<u-icon size="50rpx" slot="prefix" name="home" color="colorPrimary"></u-icon>
						</u-input>
					</view>
					<view class="input-item">
						<u-input placeholderClass="placeholder-style" fontSize="32rpx" maxlength="16" placeholder="请填写帐户" clearable v-model="account">
							<u-icon size="50rpx" slot="prefix" name="account" color="colorPrimary"></u-icon>
						</u-input>
					</view>
					<view class="input-item">
					<u-input placeholderClass="placeholder-style" fontSize="32rpx" :password="!isShowPassword" maxlength="16" placeholder="请填写密码" clearable v-model="password">
						<u-icon size="50rpx" slot="prefix" name="lock" color="colorPrimary"></u-icon>
						<u-icon size="50rpx" slot="suffix" :name="!isShowPassword?'eye-fill':'eye-off'" @click="isShowPassword = !isShowPassword"></u-icon>
					</u-input>
				</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="bind-wx">
					<u-checkbox-group>
						<u-checkbox :checked="isBindWX" shape="circle" labelSize="32rpx" label="绑定微信帐号"></u-checkbox>
					</u-checkbox-group>
				</view>
				<!-- #endif -->
				<view class="button-group">
					<u-button type="primary" text="登录" @click="onClickLogin"></u-button>
				</view>
			</view>
			<view v-else>
				<u-loading-icon></u-loading-icon>
			</view>
			<view class="company-wrapper">
				<view class="fill-view"></view>
				<view>
					<image class="company-logo" :src="require('@/static/ic_company.png')" ></image>
				</view>
				<view>
					<text class="company-info">广东省新中望信息科技有限公司</text>
				</view>
				<view>
					<text class="version-info">v0.0.1</text>
				</view>
			</view>
		</view>
		</u-transition>
		<common-widget ref="commonWidget" :visable="pageVisable"></common-widget>
	</view>
</template>

<script>
	import CommonWidget from '@/data-package/components/common-widget.vue' // 封装了 对话框，提示，加载动画等通用组件
	import commonPage from '@/data-package/mixins/common-page.js' // 配合通用组件的混入文件
	export default {
		mixins:[commonPage],
		components: {
			CommonWidget
		},
		data() {
			return {
				isAutoLogin: true,
				isShowPassword: false,
				isBindWX: true, // 是否绑定微信帐号
				showContainer: false,
				tenantId: null,
				account: null,
				password: null,
			}
		},
		methods: {
			async onClickLogin() {
				// #ifndef MP-WEIXIN
					this.isBindWX = false
				// #endif
				if (this.$isEmpty(this.tenantId)) {
					this.showWarnTips('企业号不能为空')
					return
				}
				if (this.$isEmpty(this.account)) {
					this.showWarnTips('帐号不能为空')
					return
				}
				if (this.$isEmpty(this.password)) {
					this.showWarnTips('密码不能为空')
					return
				}
				const res = await this.$api.login({ tenantId: this.tenantId, account: this.account, password: this.password, isBindWX: this.isBindWX })
				if (this.$isSuccess(res)) {
					this.navPageHome()
				} else {
					this.$showTips({type: this.$TipsType.ERROR, message: res.message || '登录失败，请稍后再试。'})
				}
			},
			navPageHome() {
				uni.reLaunch({
					url: '/data-package/pages/home/home',
				})
			},
		},
		created() {
			this.isAutoLogin = this.$notEmpty(this.$auth.getToken())
			if (this.isAutoLogin) {
				this.navPageHome()
			}
		},
		mounted() {
			setTimeout(() => {
				this.showContainer = true
			}, 300)
		}
	}
</script>

<style lang="scss">
.container {
	width: 100vw;
	height: 100vh;
}
.content {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.app-title-wrapper {
	padding: 20px 0;
}
.app-title {
	font-size: $lift-title-font-size;
}
.input-group {
	width: 80vw;
}
::v-deep.placeholder-style {
	font-size: $lift-text-font-size;
}
.input-item:not(:last-child) {
	margin-bottom: 10px;
}
.bind-wx {
	padding: 20px 0;
	width: 73vw;
}
.button-group {
	width: 80vw;
	::v-deep .u-button__text {
		font-size: $lift-text-font-size !important;
	}
}
.fill-view {
	flex: 1;
}
.company-wrapper {
	flex:1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-bottom: calc(20px + env(safe-area-inset-bottom));
	.company-logo {
		width: 60rpx;
		height: 50rpx;
	}
	.company-info {
		color: #666;
	}
	.version-info {
		color: #bbb;
	}
}
</style>
