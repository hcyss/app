<template>
	<view :class="['details-item', {'bottom-line':bottomLine}, {'top-line': topLine}]" @click="onClickDetailsItem"> 
		<view :class="['content-wrapper', {'line-wrap':wrap}]">
			<view class="title-wrapper" :style="{'font-size': fontSize}">{{title}}<text>：</text></view>
			<view :class="['value-wrapper', {'value-wrap': wrap}, {'placeholder-style':isShowPlaceholderStyle}]" :style="{'font-size': fontSize}">{{format(currentValue)}}</view>
		</view>
		<view class="icon-wrapper" v-if="edit"  @click.stop="onIconClick">
			<view>
				<u-icon :name="icon" :size="iconSize" :color="iconColor" ></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	import { colorSuccess } from "@/uni.scss"
	export default {
		name: 'details-item',
		props: {
			itemKey: {
				type: String,
				default: null
			}, // 字段唯一标识，建议与外部的ref值是一致的
			itemValue: {
				type: Object | Array | String | Number,
				default: null
			}, // 当valueName无值，则是字符串或数字，当valueName有值时候，则是对象或数组
			edit: {
				type: Boolean,
				default: false
			}, // 是否可编辑
			bottomLine: {
				type: Boolean,
				default: false
			},// 是否有底线
			topLine: {
				type: Boolean,
				default: false
			}, // 是否有顶线
			valueName: {
				type: String,
				default: null
			}, // 当value 是对象或是数组的情况下，会根据此值取显示值
			title: {
				type: String,
				default: ''
			} ,// 标题
			wrap: {
				type: Boolean,
				default: false
			}, // 标题与内容之间是否换行
			fontSize: {
				type: String,
				default: '30rpx'
			}, // 字体大小
			iconSize: {
				type: String,
				default: '50rpx'
			}, // 图标大小
			useMask: {
				type: String,
				default: null
			}, // 是否掩码，不设置就为null，需要设置掩码则提供掩码符，例如'*'
			valueFormat: {
				type: Function,
				default: null
			}, // 外部自定义的itemValue格式方法，自定义方法最终格式化后返回是字符串 
			icon: {
				type: String,
				default: 'edit-pen'
			}, // uview的图标名，edit = true才有效
			iconColor: {
				type: String,
				default: colorSuccess
			}, // 右侧图标颜色， edit = true才有效
			placeholder: {
				type: String,
				default: ''
			}, // 提示文字，当itemValue = null 并且 edit = true 才显示。
			useIconClick: {
				type: Boolean,
				default: false // 是否启用右侧按钮点击事件
			}
		},
		watch: {
			itemValue: {
				handler(nv) {
					this.handleValue(nv)
				},
				deep: true
			}
		},
		data() {
			return {
				currentValue: null,
				colorSuccess,
				fontStyle: '',
				size: '',
				isShowPlaceholderStyle: false
			}
		},
		methods: {
			onIconClick() {
				let data = {edit: this.edit, title: this.title, key: this.itemKey, value: this.itemValue}
				// console.log("onIconClick", JSON.stringify(data))
				if (this.useIconClick) {
					this.$emit('iconClick', JSON.parse(JSON.stringify(data)))
				} else {
					this.$emit("click", JSON.parse(JSON.stringify(data)))
				}
			},
			format(val){
				if (this.useMask && val != null) {
					let len = val.length || 0
					let content = ""
					for(let i = 0; i < len; i++) {
						content += this.useMask
					}
					return content
				}
				if (val == null || `${val}`.trim().length === 0 && this.placeholder != null && this.placeholder.trim().length > 0) {
					this.isShowPlaceholderStyle = true
					return this.placeholder
				} else {
					this.isShowPlaceholderStyle = false
					return val
				}
			},
			handleValue(nv) {
				if(nv == null) {
					this.currentValue = ""
					return
				} 
				if(this.valueFormat) {
					this.currentValue = this.valueFormat(nv)
				} else 
				if (typeof(nv) === 'object') {
					if (this.valueName) {
						if (Array.isArray(nv)) {
							this.currentValue = ""
							nv.forEach((it, index) => {
								if (index != 0) {
									this.currentValue += ','
								}
								this.currentValue += it[this.valueName]
							})
						} else {
							this.currentValue = nv[this.valueName]
						}
					} else {
						this.currentValue = null
					}
				} else {
					this.currentValue = nv
				}
			},
			onClickDetailsItem() {
				let data = {edit: this.edit, title: this.title, key: this.itemKey, value: this.itemValue}
				// console.log("onClickDetailsItem", JSON.stringify(data))
				this.$emit("click", JSON.parse(JSON.stringify(data)))
			}
		},
		created() {
			this.handleValue(this.itemValue)
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	.details-item {
		width: 100%;
		padding: 20rpx;
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		position: relative;
	}
	.content-wrapper {
		width: calc(100% - 50rpx);
		display: flex;
		flex-direction: row;
		align-items: center;
		overflow: hidden;
		padding: 10rpx 0;
	}
	.title-wrapper {
		color: #888;
		white-space: nowrap;
	}
	.value-wrapper {
		color: #666;
		white-space: nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.value-wrap {
		white-space: normal;
		padding-top: 10rpx;
	}
	.line-wrap {
		flex-direction: column;
		align-items: flex-start;
	}
	.icon-wrapper {
		width: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.top-line {
		border-top: 1px solid #aaa;
	}
	.bottom-line {
		border-bottom: 1px solid #aaa;
	}
	.placeholder-style {
		color: #aaa;
	}
</style>