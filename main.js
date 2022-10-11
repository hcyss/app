
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// 导包
// http接口请求包
import http from '@/components/request_http/'


// 全局挂载 
// requests请求框架
Vue.prototype.$http = http


Vue.config.productionTip = false

App.mpType = 'app'


const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
