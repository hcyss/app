<template>
	<view :class="['list-item-container', {'top-line':topLine}, {'bottom-line': bottomLine}]" :style="[{'background-color': bgColor}]" @click.top="onClickItem">
		<view class="wrapper" >
			<view v-if="useCheck" class="check-wrapper" @tap.stop.prevent>
				<view class="checkbox" @click="onCheckBox">
					<u-icon :name="isChecked?'checkmark-circle-fill':'checkmark-circle'" :color="isChecked?colorPrimary:colorTextDisable" size="40rpx"></u-icon>
				</view>
			</view>
			<view v-if="avatarSrc || avatarText || leftIcon" class="left-icon">
				<u-avatar v-if="avatarSrc" :src="avatarSrc" :size="leftIconSize" :bg-color="leftIconColor"></u-avatar>
				<u-avatar v-else-if="avatarText" :text="avatarText" :size="leftIconSize" :bg-color="leftIconColor"></u-avatar>
				<u-avatar v-else-if="leftIcon" :icon="leftIcon" :size="leftIconSize" :bg-color="leftIconColor"></u-avatar>
			</view>
			<view class="content-wrapper">
				<view v-if="ltTxt || ctTxt || rtTxt" class="row-group">
					<view v-if="ltTxt" class="row-item left">
						<view><u-text lines='1' :text="ltTxt | formatText" :color="ltColor" :size="ltSize"></u-text></view>
					</view>
					<view v-if="ctTxt" class="row-item center">
						<view><u-text lines='1' :text="ctTxt | formatText" :color="ctColor" :size="ctSize"></u-text></view>
					</view>
					<view v-if="rtTxt" class="row-item right">
						<view><u-text lines='1' :text="rtTxt | formatText" :color="rtColor" :size="rtSize"></u-text></view>
					</view>
				</view>
				<view v-if="lcTxt || ccTxt || rcTxt" class="row-group">
					<view v-if="lcTxt" class="row-item left">
						<view><u-text lines='1' :text="lcTxt | formatText" :color="lcColor" :size="lcSize"></u-text></view>
					</view>
					<view v-if="ccTxt" class="row-item center">
						<view><u-text lines='1' :text="ccTxt | formatText" :color="ccColor" :size="ccSize"></u-text></view>
					</view>
					<view v-if="rcTxt" class="row-item right">
						<view><u-text lines='1' :text="rcTxt | formatText" :color="rcColor" :size="rcSize"></u-text></view>
					</view>
				</view>
				<view v-if="lbTxt || cbTxt || rbTxt" class="row-group">
					<view v-if="lbTxt" class="row-item left">
						<view><u-text lines='1' :text="lbTxt | formatText" :color="lbColor" :size="lbSize"></u-text></view>
					</view>
					<view v-if="cbTxt" class="row-item center">
						<view><u-text lines='1' :text="cbTxt | formatText" :color="cbColor" :size="cbSize"></u-text></view>
					</view>
					<view v-if="rbTxt" class="row-item right">
						<view><u-text lines='1' :text="rbTxt | formatText" :color="rbColor" :size="rbSize"></u-text></view>
					</view>
				</view>
			</view>
			<view  v-if="rightIcon" class="right-icon"  @tap.stop.prevent>
				<view @click="onClickItemIcon">
					<u-icon :name="rightIcon" :color="rightIconColor" :size="rightIconSize"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * list-item 这个组件，最外层的结构为左、中、右结构
	 * 左右两边是icon，中间是一个九宫格的内容区域
	 * 内容区域内的参数开头命名规则：
	 *	 lt(左上)，ct(中上)，rt(右上)
	 *	 lc(左中)，cc(中中)，rc(右中)
	 *	 lb(左下)，cb(中下)，rb(右下)
	 *	如果需要某个区域隐藏，则不给值，或给null，或给空字符串。隐藏后的区域空间会被其它可见区域平分。
	 *	如果需要某个区域占位，则给空格。
	 */
	import baseMixins from "@/data-package/mixins/base.js"
	import { colorPrimary, colorTextGray, colorText, colorSubText } from "@/uni.scss"
	export default {
		name: 'ListItem',
		components: {},
		mixins: [baseMixins],
		props: {
			index: {
				type: Number,
				required: true
			},
			item: {
				type: Object,
				required: true
			},
			// selectIds: { // 选中的id集合，用于判断当前item的选中状态
			// 	type: Array,
			// 	default: () => {return []}
			// },
			updateSelectCallback: {
				type: Function,
				default: null
			},
			topLine: {
				type: Boolean,
				default: false
			},
			bottomLine: {
				type: Boolean,
				default: false
			},
			bgColor: { // 背景色
				type:String,
				default: "#fff"
			},
			/**
			 *  左侧区域 专门显示头像 或 图标
			 */
			avatarSrc: { // 头像链接，显示优先级排行1
				type: String,
				default: null
			},
			avatarText: { // 头像名称，显示优先级排行2
				type: String,
				default: null
			},
			leftIcon: { // 左侧图标，uview的系统图标名，显示优先级排行3
				type: String, 
				default: null
			},
			leftIconSize: { // 左侧图标尺寸
				type: String,
				default: "50rpx"
			},
			leftIconColor: { // 左侧图标颜色
				type: String,
				default: colorPrimary
			},
			/**
			 * 右侧区域 显示item图标操作按钮
			 */
			rightIcon: {// 右侧图标，uview的系统图标名
				type: String,
				default: "arrow-right"
			},
			rightIconSize: { // 右侧图标尺寸
				type: String,
				default: "30rpx"
			},
			rightIconColor: { // 右侧图标颜色
				type: String,
				default: colorTextGray
			},
			// ----------------------------------------------
			/**
			 * 中间内容区域，显示内容的位置为9宫格
			 * 第一行（顶行），无论是左中右列，都是主文本，字体会比较大，字体色较深色
			 * 第二行（中行），无论是左中右列，都是副文本，字体会稍微小，字体色较为浅色
			 * 第三行（底行），无论是左中右列，都是副文本，字体会稍微小，字体色较为浅色
			 */
			// 左上 lt = left-top
			ltTxt: { // 内容
				type: String|Object|Number,
				default: ''
			},
			ltSize: { // 文字大小
				type: String,
				default: "32rpx"
			},
			ltColor: { // 文字颜色
				type: String,
				default: colorText
			},
			// 左中 lc = left-center
			lcTxt: { // 内容
				type: String|Object|Number,
				default: ''
			},
			lcSize: { // 文字大小
				type: String,
				default: "30rpx"
			},
			lcColor: { // 文字颜色
				type: String,
				default: colorSubText
			},
			// 左下 lb = left-bottom
			lbTxt: { // 内容
				type: String|Object|Number,
				default: ''
			},
			lbSize: { // 文字大小
				type: String,
				default: "30rpx"
			},
			lbColor: { // 文字颜色
				type: String,
				default: colorSubText
			},
			// ----------------------------------------------
			// 中上 ct = center-top
			ctTxt: { // 内容
				type: String|Object|Number,
				default: ''
			},
			ctSize: { // 文字大小
				type: String,
				default: "32rpx"
			},
			ctColor: { // 文字颜色
				type: String,
				default: colorText
			},
			// 中中 cc = center-center
			ccTxt: { // 内容
				type: String|Object|Number,
				default: ''
			},
			ccSize: { // 文字大小
				type: String,
				default: "30rpx"
			},
			ccColor: { // 文字颜色
				type: String,
				default: colorSubText
			},
			// 中下 cb = center-bottom
			cbTxt: { // 内容
				type: String|Object|Number,
				default: ''
			},
			cbSize: { // 文字大小
				type: String,
				default: "30rpx"
			},
			cbColor: { // 文字颜色
				type: String,
				default: colorSubText
			},
			// ----------------------------------------------
			// 右上 rt = right-top
			rtTxt: { // 内容
				type: String|Object|Number,
				default: ''
			},
			rtSize: { // 文字大小
				type: String,
				default: "32rpx"
			},
			rtColor: { // 文字颜色
				type: String,
				default: colorText
			},
			// 右中 rc = right-center
			rcTxt: { // 内容
				type: String|Object|Number,
				default: ''
			},
			rcSize: { // 文字大小
				type: String,
				default: "30rpx"
			},
			rcColor: { // 文字颜色
				type: String,
				default: colorSubText
			},
			// 右下 rb = right-bottom
			rbTxt: { // 内容
				type: String|Object|Number,
				default: ''
			},
			rbSize: { // 文字大小
				type: String,
				default: "30rpx"
			},
			rbColor: { // 文字颜色
				type: String,
				default: colorSubText
			},
			useCheck: { // 是否可选
				type: Boolean, 
				default: false
			}
		},
		data() {
			return {
				isChecked: false,
			}
		},
		filters: {
			formatText(txt) {
				return txt || ''
			}
		},
		watch: {
			item: {
				handler(nv) {
					this.isChecked = nv && nv.isChecked
				},
				immediate: true,
				deep: true
			}
		},
		methods: {
			onClickItem() {
				this.$emit("click", this.index, this.item)
			},
			onClickItemIcon() {
				this.$emit("clickRightIcon", this.index)
			},
			onCheckBox() {
				this.isChecked = !this.isChecked
				this.$emit("check", this.index, this.item, this.isChecked)
				this.updateSelectCallback && this.updateSelectCallback(this.index, this.isChecked)
			}
		},
		created() {
		},
		mounted() {
		}
	}
</script>

<style lang="scss" scoped>
	.list-item-container {
		width: 100%;
		box-sizing: border-box;
		.wrapper {
			width: 100%;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			padding: 10rpx;
			.check-wrapper {
				height: 100%;
				display: flex;
				align-items: center;
				.checkbox{
					padding: 4rpx;
				}
			}
			.left-icon {
				padding: 10rpx;
			}
			.content-wrapper {
				flex:1;
				height: 100%;
				display: flex;
				flex-direction: column;
				overflow: hidden;
				.row-group {
					width: 100%;
					flex: 1;
					display: flex;
					flex-direction: row;
					.row-item {
						display: flex;
						align-items: center;
					}
					.left {
						justify-content: left;
						max-width: calc(70%);
					}
					.right {
						justify-content: flex-end;
						flex: 1;
					}
					.center {
						justify-content: center;
						flex:1;
					}
					&:not(:last-child) {
						padding-bottom: 4px;
					}
				}
			}
			.right-icon {
				padding: 10rpx;
			}
		}	
	}
	.top-line {
		border-top: 1px solid $uni-text-color-grey;
	}
	.bottom-line {
		border-bottom: 1px solid $uni-text-color-grey;
	}
</style>