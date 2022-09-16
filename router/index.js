import {
	RouterMount,
	createRouter
} from 'uni-simple-router';
import auth from "@/data-package/utils/auth.js"

const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routes: [
		...ROUTES,
		{
			path: '*',
			redirect: (to) => {
				return {
					name: 'index'
				}
			}
		},
	]
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	console.log("全局路由拦截 -> beforeEach");
	if (!to.meta.auth) {
		// console.log('无需访问授权');
		// 无需登录验证，直接放行
		next();
	} else
	if (to.meta.auth && auth.getToken()) { //  && auth.getRefreshToken()
		// console.log('已有访问授权，可访问')
		// 需登录验证，判断是否有token和refreshToken，有则放行，无则返回首页
		next();
	} else {
		// console.log('未有访问授权，返回登录页');
		// 没满足验证条件的，跳回主页
		auth.removeLoginInfo()
		next({
			path: '/pages/index/index'
		});
	}
});
// 全局路由后置守卫
router.afterEach((to, from) => {
	// console.log('全局路由拦截 -> afterEach')
})



export {
	router,
	RouterMount
}
