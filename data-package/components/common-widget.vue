<template>
	<!-- 
	commonWidget只在page引用，一般不在普通组件中引用。
	因为普通组件是没有生命周期去维护事件监听，会缺失部分全局组件的功能。
	如果，普通组件中需要调用commonWidget的api，则可通过使用this.$getPageCommonWidget来完成调用。
	 -->
	<view :class="['widget-contianer', {'mask': isShowLoading || isShowDialog || isShowToast || isShowPopup || isShowPicker || isShowActionSheet }]" @click="onClickMask">
		<u-notify ref="uNotify"></u-notify>
		<u-toast ref="uToast"></u-toast>
		<u-modal ref="uModal" :show="isShowDialog"  :title="dialogData.title" 
			 @confirm="onDialogConfirm" :confirmText="dialogData.confirmText"
			 @cancel="onDialogCancel" :cancelText="dialogData.cancelText"
			 :showCancelButton="dialogData.showCancelButton" :closeOnClickOverlay="dialogData.closeOnClickOverlay"
		>
			<view class="slot-content">
				<rich-text :nodes="dialogData.content"></rich-text>
			</view>
		</u-modal>
		<view class="loading">
			<u-loading-icon :color="loadingData.color" :text="loadingData.text" v-if="isShowLoading"></u-loading-icon>
		</view>
		<u-popup safeAreaInsetBottom :show="isShowPopup"  mode="bottom">
			<view class="popup-container">
				<view class="popup-title">{{popupData.data | formatPopupTitle}}</view>
				<view class="top-button-group" v-if="popupData.data && popupData.data.edit">
					<view><u-text type="default" text="取消" size="30rpx" @click="isShowPopup = false"></u-text></view>
					<view style="flex: 1;"></view>
					<view><u-text type="primary" text="确定" size="30rpx" @click="onSubmitPopup"></u-text></view>
				</view>
				<view class="widget-group">
					<view class="widget-items" v-if="TYPE_PASSWORD === popupData.inputType">
						<!-- 密码输入框组件 -->
						<u-input :placeholder="`请输入${popupData.data.title ||'内容'}`" v-model="popupData.data.value" :maxlength='popupData.txtLength' :password='isPassword'>
							<u-icon slot="suffix" size="40rpx" :name="isPassword?'eye-fill':'eye-off'" @click="isPassword = !isPassword"></u-icon>
						</u-input>
					</view>
					<view class="widget-items" v-else-if="TYPE_INPUT === popupData.inputType">
						<!-- 输入框组件 -->
						<u-input :placeholder="`请输入${popupData.data.title ||'内容'}`" v-model="popupData.data.value" :maxlength='popupData.txtLength'>
						</u-input>
					</view>
					<view class="widget-items checkbox-group" v-else-if="TYPE_SINGLE_SELECT === popupData.inputType || TYPE_MULTI_SELECT === popupData.inputType">
						<!-- 多选组件 -->
						<uni-data-checkbox :multiple="TYPE_MULTI_SELECT === popupData.inputType" min="1" mode="tag" v-model="popupData.select" :localdata="popupData.dataList" @change="onChangeCheckBoxGroup"></uni-data-checkbox>
					</view>
					<view class="widget-items" v-else-if="TYPE_TEXTAREA === popupData.inputType">
						<!-- 文本域框组件 -->
						<u-textarea v-model="popupData.data.value" :placeholder="`请输入${popupData.data.title||'内容'}`" confirmType="done" ></u-textarea>
					</view>
					<view class="widget-items" v-else-if="TYPE_NUMBER === popupData.inputType">
						<!-- 数字步进组件 -->
						<u-number-box :min="popupData.min" :max="popupData.max" v-model="popupData.data.value" @change="numberChange"></u-number-box>
					</view>
					<view class="widget-items" v-else>
						<text>未有合适的数据类型</text>
					</view>
					<view v-if="!(popupData.data && popupData.data.edit)" class="only-read"></view>
				</view>
				<!-- <view class="btn-group" v-if="popupData.data && popupData.data.edit">
					<u-button type="primary" @click="onSubmitPopup">确认</u-button>
					<view class="btn-span">
					</view>
					<u-button type="error" @click="isShowPopup = false">取消</u-button>
				</view> -->
			</view>
		</u-popup>
		<!--  滚轮单选、滚轮级联（3层）组件 -->
		<view v-if="TYPE_CASCADE === popupData.inputType">
			<u-picker 
				ref="uPicker" 
				:title="`编辑${popupData.data.title}`" 
				:show="isShowPicker && TYPE_CASCADE === popupData.inputType" 
				:keyName="popupData.labelName" 
				:defaultIndex="popupData.select" 
				:columns="popupData.dataList" 
				:loading="pickerLoading"
				@change="onChangePicker"
				@confirm="onComfirmPicker" @cancel="isShowPicker = false">
			</u-picker>
		</view>
		<!-- 日期、日期时间组件 -->
		<view v-if="TYPE_DATETIME === popupData.inputType || TYPE_DATE === popupData.inputType">
			<u-datetime-picker
				ref="uDateTimePicker"
				:title="`编辑${popupData.data.title}`"
				:show="isShowPicker && (TYPE_DATETIME === popupData.inputType || TYPE_DATE === popupData.inputType)"
				v-model="popupData.select"
				:minDate="popupData.min"
				:maxDate="popupData.max"
				:formatter="dateTimeFormatter"
				@confirm="onComfirmDateTimePicker" 
				@cancel="isShowPicker = false"
				:mode="TYPE_DATETIME === popupData.inputType?'datetime':'date'">
			</u-datetime-picker>
		</view>
		<view v-if='isShowActionSheet'>
			<u-action-sheet @select="onSelectActionSheet" @close="onCloseActionSheet" :actions="actionSheetData.list" :title="actionSheetData.title" :show="isShowActionSheet" :cancelText="actionSheetData.cancelText"  safeAreaInsetBottom></u-action-sheet>
		</view>
	</view>
</template>
	
<script>
	import commonWidgetMixins from "@/data-package/mixins/common-widget.js"
	import UniDataCheckbox from "@/data-package/components/uni-data-checkbox/uni-data-checkbox.vue"
	export default {
		name: 'CommonWidget',
		components: {UniDataCheckbox},
		mixins:[commonWidgetMixins],
		data() {
			return {
				isPassword: false,
				pickerLoading: false,
			}
		},
		onReady() {
			// #ifdef MP-WEIXIN
			// 微信小程序需要用此写法
			let dateTimePicker = this.$refs.uDateTimePicker
			if (dateTimePicker) {
				dateTimePicker.setFormatter(this.dateTimeFormatter)
			}
			// #endif
		},
		mounted() {
			
		},
		filters: {
			formatPopupTitle(data) {
				if (data && data.title) {
					if (data.edit) {
						return `编辑${data.title}`
					} else {
						return data.title
					}
				}
				return ''
			}
		},
		methods: {
			async onChangePicker(e) {
				// console.log("onChangePicker", e)
				let columnCount = 0 // 共有多少个数据列
				if (this.popupData.dataList) {
					columnCount = this.popupData.dataList.length
				}
				const {
					columnIndex, // 当前是第几列触发改变
					index, // 当前列选中的项的序号
					value, // 当前所有列的选项
				} = e
				if (columnIndex < columnCount - 1) {
					if (this.popupData.cascadeMethod) {
						this.pickerLoading = true
						let colunmItem = value[columnIndex] // 当前列 的 选中项
						let allColunmItem = value.filter((it, index) => index <= columnIndex) // 第一列 至 当前列 的 选中项
						// 向外部获取下一列到最后一列的列数据。参数：列总数，当前列的序号，当前列选中项的序号，当前列选中项数据，所有列选中项的数据
						let lists = await this.popupData.cascadeMethod(columnCount, columnIndex, index, colunmItem, allColunmItem)
						lists.forEach((list, index) => {
							this.$refs.uPicker.setColumnValues(columnIndex + index + 1, list) // 设置下一列的数据
							if(list.length > 0) {
								allColunmItem.push(list[0])
							}
						})
						this.popupData.data.value = allColunmItem
						this.pickerLoading = false
					}
				} else {
					this.popupData.data.value = value
				}
				// console.log("this.popupData.data = ", JSON.stringify(this.popupData.data))
			},
			dateTimeFormatter(type, value) {
				if (type === 'year') {
					return `${value}年`
				} else 
				if (type === 'month') {
					return `${value}月`
				} else
				if (type === 'day') {
					return `${value}日`
				} else
				if (type === 'hour') {
					return `${value}时`
				} else
				if (type === 'hour') {
					return `${value}时`
				} else
				if (type === 'minute') {
					return `${value}分`
				}
				return value
			},
			onChangeCheckBoxGroup({ detail } = e) {
				if (this.popupData.inputType === this.TYPE_MULTI_SELECT) {
					this.popupData.data.value = detail.data.map(it => {
						let data = {}
						data[this.popupData.keyName] = it.value
						data[this.popupData.labelName] = it.text
						return data
					})
				} else 
				if (this.popupData.inputType === this.TYPE_SINGLE_SELECT) {
					let { text, value } = detail.data
					let data = {}
					data[this.popupData.keyName] = value
					data[this.popupData.labelName] = text
					this.popupData.data.value = data
				}
				
			},
			numberChange(number) {
				this.popupData.data.value = number.value
			},
			showNumber(data) {
				if (!data.data.edit) return
				data.inputType = this.TYPE_NUMBER
				if(data.min == null || data.max == null) {
					console.log('请设置最大许可值（data.max）与最少许可值（data.min）')
					return
				}
				this.showPopup(data)
			},
			showSingleSelect(data) {
				data.inputType = this.TYPE_SINGLE_SELECT
				if (data.data == null) {
					console.log("请设置显示的数据（data.data）")
					return
				}
				if (Array.isArray(data.data.dataList)) {
					console.log("请设置可选数据（data.data.dataList）")
					return
				}
				if (data.keyName == null || data.keyName.trim().length === 0) {
					console.log("请设置数据标识字段名（data.keyName）")
					return
				}
				if (data.labelName == null || data.labelName.trim().length === 0) {
					console.log("请设置数据展示字段名（data.labelName）")
					return
				}
				data.select = null
				// console.log(data.data.value[data.keyName], data.keyName, data.data.value)
				if (data.data.value != null) {
					data.select = data.data.value[data.keyName]
				}
				data.dataList = data.dataList.map(it => {
					return {
						value: it[data.keyName],
						text: it[data.labelName]
					}
				})
				this.showPopup(data)
			},
			showMultiSelect(data) {
				data.inputType = this.TYPE_MULTI_SELECT
				if (data.data == null) {
					console.log("请设置显示的数据（data.data）")
					return
				}
				if (Array.isArray(data.data.dataList)) {
					console.log("请设置可选数据（data.data.dataList）")
					return
				}
				if (data.keyName == null || data.keyName.trim().length === 0) {
					console.log("请设置数据标识字段名（data.keyName）")
					return
				}
				if (data.labelName == null || data.labelName.trim().length === 0) {
					console.log("请设置数据展示字段名（data.labelName）")
					return
				}
				data.select = []
				if (data.data.value != null && data.data.value.length > 0) {
					data.data.value.forEach(it =>  data.select.push(it[data.keyName]))
				}
				data.dataList = data.dataList.map(it => {
					return {
						value: it[data.keyName],
						text: it[data.labelName]
					}
				})
				this.showPopup(data)
				// console.log(this.popupData)
			},
			showDate(data) {
				if (!data.data.edit) return
				data.inputType = this.TYPE_DATE
				if (typeof(data.data.value) !== 'number') {
					console.log("请设置显示数据为时间戳（data.data.value）")
					return
				}
				if (typeof(data.min) !== 'number') {
					console.log("请设置时间下限，并且为时间戳（data.min）")
					return
				}
				if (typeof(data.max) !== 'number') {
					console.log("请设置时间上限，并且为时间戳（data.max）")
					return
				}
				if (data.max <= data.min) {
					console.log("时间上限 必须大于 时间下限（data.max > data.min）")
					return
				}
				data.select = data.data.value
				this.showPicker(data)
			},
			showDateTime(data) {
				if (!data.data.edit) return
				data.inputType = this.TYPE_DATETIME
				if (typeof(data.data.value) !== 'number') {
					console.log("请设置显示数据为时间戳（data.data.value）")
					return
				}
				if (typeof(data.min) !== 'number') {
					console.log("请设置时间下限，并且为时间戳（data.min）")
					return
				}
				if (typeof(data.max) !== 'number') {
					console.log("请设置时间上限，并且为时间戳（data.max）")
					return
				}
				if (data.max <= data.min) {
					console.log("时间上限 必须大于 时间下限（data.max > data.min）")
					return
				}
				data.select = data.data.value
				this.showPicker(data)
			},
			showCascade(data) {
				if (!data.data.edit) return
				// console.log("showCascade")
				data.inputType = this.TYPE_CASCADE
				if (data.data == null) {
					console.log("请设置显示的数据（data.data）")
					return
				}
				if (Array.isArray(data.data.dataList)) {
					console.log("请设置可选数据（data.data.dataList）")
					return
				}
				if (data.keyName == null || data.keyName.trim().length === 0) {
					console.log("请设置数据标识字段名（data.keyName）")
					return
				}
				if (data.labelName == null || data.labelName.trim().length === 0) {
					console.log("请设置数据展示字段名（data.labelName）")
					return
				}
				if (Array.isArray(data.dataList) && data.dataList.length > 0 && !Array.isArray(data.dataList[0])) {
					data.dataList = [data.dataList]
				}
				let selectIds
				if (data.data.value != null) {
					if (Array.isArray(data.data.value)) {
						selectIds = data.data.value.map(it => it[data.keyName])
					} else {
						selectIds = []
						selectIds.push(data.data.value[data.keyName])
					}
				} else {
					selectIds = []
				}
				if (selectIds.length > 0) {
					data.select = data.dataList.map((list, index) => {
						if (index < selectIds.length) {
							let selectId = selectIds[index]
							for (let i = 0; i < list.length; i++) {
							 	let item = list[i]
								if (item[data.keyName] === selectId) {
									return i
								} 
							}
							return 0
						} else {
							return 0
						}
					})
				} else {
					data.select = []
				}
				// console.log(">++++>", data)
				this.showPicker(data)
			},
			showInput(data) {
				if (!data.data.edit) return
				data.inputType = this.TYPE_INPUT
				if (data.data.value == null) {
					data.data.value = ''
				}
				this.isPassword = false
				this.showPopup(data)
			},
			showTextArea(data) {
				if (!data.data.edit) return
				data.inputType = this.TYPE_TEXTAREA
				if (data.data.value == null) {
					data.data.value = ''
				}
				this.showPopup(data)
			},
			showPassword(data) {
				if (!data.data.edit) return
				data.inputType = this.TYPE_PASSWORD
				this.isPassword = true
				this.showPopup(data)
			},
			onSubmitPopup() {
				let data = JSON.parse(JSON.stringify(this.popupData.data))
				this.popupCallback(data)
				this.isShowPopup =  false
			},
			onComfirmDateTimePicker(e) {
				let data = JSON.parse(JSON.stringify(this.popupData.data))
				data.value =  this.popupData.valueFormatMethod? this.popupData.valueFormatMethod(e.value):e.value
				this.popupCallback(data)
				this.isShowPicker = false
			},
			onComfirmPicker(e) {
				let data = JSON.parse(JSON.stringify(this.popupData.data))
				data.value = this.popupData.valueFormatMethod? this.popupData.valueFormatMethod(e.value):e.value
				this.popupCallback(data)
				this.isShowPicker = false
			},
			popupCallback(data) {
				if (this.popupData.popupSelectMethod) {
					this.popupData.popupSelectMethod(data)
				} else {
					this.$emit("popupSelect", data)
				}
			},
			getTipsInstance() {
				return this.$refs.uNotify
			},
			getToastInstance() {
				return this.$refs.uToast
			}
		}
	}
</script>

<style lang="scss" scoped>
	.widget-contianer {
		position: absolute;
		z-index: 1000;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
	}
	.mask {
		pointer-events: auto;
	}
	.only-read {
		pointer-events: auto;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		pointer-events: none;
	}
	
	::v-deep.uni-data-checklist .checklist-group {
		justify-content: center !important;
	}
	
	.popup-container {
		display: flex;
		height: 50%;
		flex-direction: column;
		position: relative;
		.popup-title {
			padding: 20rpx;
			display: flex;
			justify-content: center;
			font-size: 32rpx;
		}
		.top-button-group {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			display: flex;
			padding: 0 20rpx;
			box-sizing: border-box;
			margin-top: 18rpx;
		}
		.widget-group {
			padding: 20rpx;
			margin-bottom: 20rpx;
			.widget-items {
				width: 100%;
				display: flex;
				justify-content: center;
				position: relative;
			}
		}
		.btn-group {
			display: flex;
			padding: 20rpx;
			.btn-span {
				width: 20px;
			}
		}
	}
	.checkbox-item {
		width: 100%;
		padding: 10px;
		border-bottom: 1px solid #999;
	}
</style>