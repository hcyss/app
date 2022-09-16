import App from './App'
import uView from '@/uview-ui'
import {router, RouterMount} from '@/router'
import dayjs from "dayjs"
import auth from '@/data-package/utils/auth.js'
import api from '@/data-package/utils/api/api.js'
import Business from '@/data-package/utils/business/business.js'
import wxApi from '@/data-package/utils/api/wxApi.js'
import event from '@/data-package/utils/event.js'
import TipsType from '@/data-package/utils/tips-type.js'
import CommonWidgetHelper from '@/data-package/utils/CommonWidgetHelper.js'
import { toFixed, useTestData, showLoading, hideLoading, showDialog, showTips, showToast, isResSuccess, isEmpty, notEmpty, setContentPosition, getContentPosition } from '@/data-package/utils/common.js'
// #ifndef VUE3
import Vue from 'vue'
Vue.use(router)
Vue.use(uView)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
useTestData(true) // 是否使用静态数据
Vue.prototype.$isDev = () => process.env.NODE_ENV !== 'production'
Vue.prototype.$isProd = () => process.env.NODE_ENV === 'production'
Vue.prototype.$api = api // 业务数据请求api
Vue.prototype.$b = Business // 业务逻辑工具
Vue.prototype.$dayjs = dayjs // 日期工具
Vue.prototype.$auth = auth // localstorage封装工具
Vue.prototype.$wxApi = wxApi // 微信api
Vue.prototype.$event = event // 事件总线
Vue.prototype.$showLoading = showLoading // 显示遮罩
Vue.prototype.$hideLoading = hideLoading // 隐藏遮罩
Vue.prototype.$showDialog = showDialog // 显示对话框
Vue.prototype.$showTips = showTips // 显示提示消息
Vue.prototype.$showToast = showToast // 显示吐司
Vue.prototype.$isSuccess = isResSuccess // 请求是否成功
Vue.prototype.$isEmpty = isEmpty // 是否空
Vue.prototype.$notEmpty = notEmpty // 是否非空
Vue.prototype.$TipsType = TipsType // 提示类型
Vue.prototype.$toFixed = toFixed // 小数点截断到小数点某几位
Vue.prototype.$setContentPosition = setContentPosition // 保存内容区域top和bottom
Vue.prototype.$getContentPosition = getContentPosition // 获取内容区域top和bottom
Vue.prototype.$setPageCommonWidget = CommonWidgetHelper.setPageCommonWidget // 保存当前获取焦点页面的CommonWidget组件实例
Vue.prototype.$getPageCommonWidget = CommonWidgetHelper.getPageCommonWidget // 获取当前获取焦点页面的CommonWidget组件实例
Vue.prototype.$removePageCommonWidget = CommonWidgetHelper.removePageCommonWidget // 移除当前页面的CommonWidget组件实例
//uni-simple-router：v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app, router,'#app')
// #endif

// #ifndef H5
	app.$mount() // 为了兼容小程序及app端必须这样写才有效果
// #endif
// app.$mount() // 如果不使用uni-simple-router，则注释上述代码，释放这段代码
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif