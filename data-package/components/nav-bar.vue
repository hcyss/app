<template>
	<view id="navBar" class="naviation-bar-container">
		<u-navbar
			:title="nvParams.title"
			:bgColor="nvParams.bgColor"
			placeholder
			:titleStyle="nvParams.titleStyle">
		<view slot="left">
		<!-- #ifdef MP-WEIXIN -->
			<view
				v-if="nvParams.rightIcon || nvParams.rightText"
				class="slot-style"
			>
				<view class="slot-style" v-if="canBack || params.leftIcon || params.leftText" @click="onClickLeftBtn">
					<u-icon
						v-if="nvParams.leftIcon"
						:name="nvParams.leftIcon"
						:size="nvParams.leftIconSize"
						:color="nvParams.leftIconColor"/>
					<text :style="{'color':nvParams.textColor, 'font-size':nvParams.textSize }" v-if="nvParams.leftText">{{nvParams.leftText}}</text>
				</view>
				<u-line
					v-if="canBack || params.leftIcon || params.leftText"
					direction="column"
					:hairline="false"
					length="16"
					margin="0 8px"
				></u-line>
				<view class="slot-style"  @click="onClickRightBtn">
					<u-icon
						v-if="nvParams.rightIcon"
						:name="nvParams.rightIcon"
						:size="nvParams.rightIconSize"
						:color="nvParams.rightIconColor"/>
					<text :style="{'color':nvParams.textColor, 'font-size':nvParams.textSize }" v-if="nvParams.rightText">{{nvParams.rightText}}</text>
				</view>
			</view>
			<view v-else>
				<view class="slot-style" v-if="canBack || params.leftIcon || params.leftText" @click="onClickLeftBtn">
					<u-icon
						v-if="nvParams.leftIcon"
						:name="nvParams.leftIcon"
						:size="nvParams.leftIconSize"
						:color="nvParams.leftIconColor"/>
					<text :style="{'color':nvParams.textColor, 'font-size':nvParams.textSize }" v-if="nvParams.leftText">{{nvParams.leftText}}</text>
				</view>
			</view>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
			<view class="slot-style" v-if="canBack || params.leftIcon || params.leftText" @click="onClickLeftBtn">
				<u-icon
					v-if="nvParams.leftIcon"
					:name="nvParams.leftIcon"
					:size="nvParams.leftIconSize"
					:color="nvParams.leftIconColor"/>
				<text :style="{'color':nvParams.textColor, 'font-size':nvParams.textSize }" v-if="nvParams.leftText">{{nvParams.leftText}}</text>
			</view>
		<!-- #endif -->
		</view>
		<view slot="right">
			<view class="slot-style"  @click="onClickRightBtn">
				<u-icon
					v-if="nvParams.rightIcon"
					:name="nvParams.rightIcon"
					:size="nvParams.rightIconSize"
					:color="nvParams.rightIconColor"/>
				<text :style="{'color':nvParams.textColor, 'font-size':nvParams.textSize }" v-if="nvParams.rightText">{{nvParams.rightText}}</text>
			</view>
		</view>
		</u-navbar>
	</view>
</template>

<script>
	import { colorPrimary } from "@/uni.scss"
	export default {
		name: 'NavBar',
		props: {
			params: {
				type: Object,
				default: () => { return {}}
			}
		},
		watch: {
			params: {
				handler(nv) {
					this.nvParams = Object.assign(this.defParams, nv)
				},
				deep: true,
				immediate:true
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			if (wx.hideHomeButton) {
				wx.hideHomeButton()
			}
			// #endif
		},
		data() {
			return {
				defParams: {
					title: '',
					leftIconColor: '#fff',
					rightIconColor: '#fff',
					titleStyle: 'color: #fff;',
					textColor: '#fff',
					textSize: '14px',
					leftIcon: 'arrow-left',
					leftText: null,
					leftIconSize: '20px',
					rightIcon: null,
					rightText: null,
					rightIconSize: '20px',
					bgColor: colorPrimary
				},
				nvParams: {},
				canBack: false,
			}
		},
		methods: {
			onClickLeftBtn() {
				if (this.params.leftIcon || this.params.leftText) {
					this.$emit("leftClick")
				} else 
				if (this.canBack) {
					uni.navigateBack()
				}
			},
			onClickRightBtn() {
				this.$emit("rightClick")
			}
		},
		created() {
			this.canBack = getCurrentPages().length > 1
		},
		mounted() {
		}
	}
</script>

<style lang="scss" scoped>
.naviation-bar-container {
	z-index: 100;
}
.slot-style {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>