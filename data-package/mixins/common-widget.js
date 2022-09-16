import ebEvent from '@/data-package/utils/event.js'
import { colorPrimary } from "@/uni.scss"
import InputType from "@/data-package/utils/input-type.js"

export default {
	props:{
		visable: false // 用于关联页面的显示和隐藏时候，触发事件监听的开启和关闭
	},
	watch:{
		visable: {
			handler(nv) {
				nv?this.onShow():this.onHide()
			},
			immediate: true
		}
	},
	data() {
		return {
			...InputType,
			ebEvent,
			defDialogData: { title: '提示', content: '', confirm: () => {}, confirmText: '确认', cancel: () => {}, cancelText: '取消', showCancelButton: false, closeOnClickOverlay: false },
			defLoadingData: { text: '', color: colorPrimary },
			defTipsData: { top: 0, type: 'success', message: '', duration: 3000, fontSize: 20, safeAreaInsetTop: true },
			defToastData: { type: 'default', message: '', icon: '', position: 'bottom', params: null, duration: 2000, complete: () => {} },
			defPopupData: {
				inputType: null, // 输入数据类型
				data: null, // 来源数据
				valueFormatMethod: null, // 展示值返回时候的格式化方法，由外部定义并提供
				dataList: [], // 多选、单选列表的数据
				select: [], // 选中的数据
				keyName: null, // 选中返回的值键名
				labelName: null, // 显示的值的键名
				max: null, // 最大许可值
				min: null, // 最小许可值
				txtLength: -1, // 文本长度
				cascadeMethod: null, // 级联请求获取下级数据的方法
				popupSelectMethod: null, // 选中回调方法，如果不实现，则会调用组件的$emit返回
			},
			defActionSheetData: {
				title: "请选择",
				list: [], // {name:'选项名称', ...其它字段名任意 }
				cancelText: '取消', 
				selectMethod: null // 选中的回调
			},
			actionSheetData: null,
			popupData: null,
			toastData: null,
			dialogData: null,
			loadingData: null,
			isShowDialog: false,
			isShowLoading: false,
			isShowToast: false,
			isShowPopup: false,
			isShowPicker: false,
			isShowActionSheet: false,
			colorPrimary
		}
	},
	methods: {
		showActionSheet(data) {
			let defData = JSON.parse(JSON.stringify(this.defActionSheetData))
			this.actionSheetData = Object.assign(defData, data)
			this.isShowActionSheet = true
		},
		onSelectActionSheet(e) {
			this.actionSheetData.selectMethod && this.actionSheetData.selectMethod(e)
		},
		onCloseActionSheet() {
			this.isShowActionSheet = false
		},
		showPicker(data) {
			let defData = JSON.parse(JSON.stringify(this.defPopupData))
			this.popupData = Object.assign(defData, data)
			this.isShowPicker = true
		},
		showPopup(data) {
			let defData = JSON.parse(JSON.stringify(this.defPopupData))
			this.popupData = Object.assign(defData, data)
			this.isShowPopup = true
		},
		onClickMask() {
			// console.log("onClickMask")
			if (this.isShowDialog && this.dialogData && this.dialogData.closeOnClickOverlay) {
				this.dialogData.cancel && this.dialogData.cancel()
				this.isShowDialog = false
			} else 
			if (this.isShowPopup) {
				this.isShowPopup = false
			} else 
			if (this.isShowPicker) {
				this.isShowPicker = false
			} else 
			if (this.isShowActionSheet) {
				this.isShowActionSheet = false
			}
		},
		onDialogConfirm() {
			this.dialogData && this.dialogData.confirm && this.dialogData.confirm()
			this.isShowDialog = false
		},
		onDialogCancel() {
			this.dialogData && this.dialogData.cancel && this.dialogData.cancel()
			this.isShowDialog = false
		},
		onShow() {
			// console.log("common-widget onShow");
			uni.$on(this.ebEvent.SHOW_LOADING, this.showLoading)
			uni.$on(this.ebEvent.HIDE_LOADING, this.hideLoading)
			uni.$on(this.ebEvent.SHOW_DIALOG, this.showDialog)
			uni.$on(this.ebEvent.SHOW_TIPS, this.showTips)
			uni.$on(this.ebEvent.SHOW_TOAST, this.showToast)
			this.$setPageCommonWidget(this)
		},
		onHide() {
			// console.log("common-widget onHide");
			uni.$off(this.ebEvent.SHOW_LOADING, this.showLoading)
			uni.$off(this.ebEvent.HIDE_LOADING, this.hideLoading)
			uni.$off(this.ebEvent.SHOW_DIALOG, this.showDialog)
			uni.$off(this.ebEvent.SHOW_TIPS, this.showTips)
			uni.$off(this.ebEvent.SHOW_TOAST, this.showToast)
			this.$removePageCommonWidget()
		},
		showLoading(data) {
			// console.log("show loading", data)
			this.loadingData = Object.assign(this.defLoadingData, data)
			this.isShowLoading = true
		},
		hideLoading() {
			// console.log("hide loading")
			this.isShowLoading = false
		},
		showDialog(data) {
			// console.log("showDialog", data)
			this.dialogData = Object.assign(this.defDialogData, data)
			this.isShowDialog = true
		},
		showTips(data) {
			// console.log("showTips", data)
			let tips = this.getTipsInstance()
			if (tips) {
				let tipsData = Object.assign(this.defTipsData, data)
				tips.show(tipsData)
			}
		},
		showToast(data) {
			// console.log("showToast", data)
			let toast = this.getToastInstance()
			if (toast) {
				this.toastData = Object.assign(this.defToastData, data)
				this.toastData.complete = this.cureateToastComplete(data.complete)
				toast.show(this.toastData)
				this.isShowToast = true
			}
		},
		cureateToastComplete(callback) {
			return () => {
				this.isShowToast = false
				callback && callback()
			}
		},
		getToastInstance() {
			console.log("请组件实现getTipsInstance方法，返回toast组件实例，才可调用toast组件")
			return null
		},
		getTipsInstance() {
			console.log("请组件实现getTipsInstance方法，返回tips组件实例，才可调用tips组件")
			return null
		},
	},
	created() {
		// console.log("common-widget created");
		this.popupData = JSON.parse(JSON.stringify(this.defPopupData))
		this.dialogData = JSON.parse(JSON.stringify(this.defDialogData))
		this.loadingData = JSON.parse(JSON.stringify(this.defLoadingData))
	}
}
