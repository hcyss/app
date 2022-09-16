<template>
	<view class="container">
		<u-transition show mode="fade">
		<view class="page">
			<navbar :params="navbarParams"></navbar>
			<view class="content">
				<view>
					使用全局的dialog，tips，loading，toast组件<br>
					<br>
					1. 导入CommonWidget组件。此组件封装了dialog，tips，loading, toast组件，一般只在路由跳转的页面引用，对于嵌套的组件页面不使用，因为嵌套的组件页面缺少onShow和onHide的回调。<br>
					<br>
					2. 导入commonPage混入文件，作用监听onShow和onHide的回调，通过pageVisable传递给CommonWidget告知何时注册监听，何时取消监听。确保在最顶层的页面，才处理通用组件事件调用。<br>
					<br>
					3. pageVisable变量，是commonPage混入文件提供的变量，不允许修改。其值是需要传入给CommonWidget组件的。作为当前页面的事件注册监听和注销监听的标志位。<br>
					<br>
					4. 在普通的组件中，如需要调用页面的CommonWidget的api，则通过可通过使用this.$getPageCommonWidget来完成调用，也可通过CommonWidgetHelper来完成调用。<br>
				</view>
				<u-button type="primary" @click="onShowTips">提示消息</u-button>
				<u-button type="success" @click="onShowDialog">对话框</u-button>
				<u-button type="error" @click="onShowLoading">加载动画</u-button>
				<u-button type="primary" @click="onToast">吐司</u-button>
			</view>
		</view>
		</u-transition>
		<!-- pageVisable 由混入文件提供的变量，不能改，不要私下自定义此变量 -->
		<common-widget ref="commonWidget" :visable="pageVisable"></common-widget>
	</view>
</template>

<script>
	import Navbar from '@/data-package/components/nav-bar.vue' // 导航栏
	import CommonWidget from '@/data-package/components/common-widget.vue' // 封装了 对话框，提示，加载动画等通用组件
	import commonPage from '@/data-package/mixins/common-page.js' // 配合通用组件的混入文件，对生命周期
	export default {
		components: {Navbar, CommonWidget},
		mixins:[commonPage],
		data() {
			return {
				navbarParams: {
					title: '演示'
				}
			}
		},
		methods: {
			onShowTips() {
				this.showSucTips("你有一条未读消息")
				// this.showWarnTips("警告提示")
				// this.showErrTips("错误的提示")
				// 更灵活的调用，可调用this.$showTips({参数...})
				/**
				 * 参数 
				 * { 
				 *   top: 0, // 消息的顶部的垂直偏移
				 * 	 type: this.$TipsType.SUCCESS, // 消息类型 参考utils/tips-type.js
				 *   message: '',  // 消息内容
				 *   duration: 3000, // 消息显示时长 毫秒
				 *   fontSize: 20,  // 字体大小
				 *   safeAreaInsetTop: true // 顶部位置是否在安全区域中
				 * }
				 */
			},
			onShowDialog() {
				this.showDialog({
					title: '演示dialog使用',
					content: '发现App新版本，是否下载升级？',
					confirm: () => {
						console.log('对话框 => 确认')
					},
					cancel: () => {
						console.log('对话框 => 取消')
					},
					showCancelButton: true,
					closeOnClickOverlay: true
				})
				/**
				 * 参数
				 *	{ 
			     *	  title: '提示', // 提示标题
				 *    content: '',  // 内容
				 *    confirm: () => {}, // 确认按钮回调方法
				 *    confirmText: '确认', // 确认按钮描述内容
				 *    cancel: () => {}, // 取消按钮回调方法
				 *    cancelText: '取消', // 取消按钮描述内容
				 *    showCancelButton: false, // 是否显示取消按钮
				 *    closeOnClickOverlay: false // 是否点击遮罩关闭
				 *  }	
				 */
			},
			onShowLoading() {
				this.showLoading() // 显示加载
				setTimeout(() => {
					this.hideLoading() // 关闭加载
				}, 3000)
				// 更灵活使用可调用this.$showLoading({参数...})
				/**
				 * { 
				 *	 text: '',  // loading提示
				 *   color: colorPrimary // 动画icon的颜色
				 * }
				 */
			},
			onToast() {
				this.showSucToast('提交成功', () => {
					uni.navigateTo({
						url: '/data-package/pages/demo/list'
					})
				}) // 显示成功的吐司，并跳转
				// this.showErrToast('用户名或密码错误') // 显示错误的吐司
				// this.showToast('请填写联系人电话号码') // 默认的吐司
				// 更灵活使用可调用this.$showToast({参数...})
				/**
				 * { 
					 text: '',  // loading提示
				 *   color: colorPrimary // 动画icon的颜色
				 * }
				 */
			}
		},
		mounted() {
			
		}
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
