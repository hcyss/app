// 这个工具，是让page中的commonWidget组件能被page中的其它组件调用（兄弟组件调用）。
// commonWidget只在page引用，一般不在普通组件中引用。因为普通组件是没有生命周期去维护事件监听，会缺失部分全局组件的功能。
let currentPageCommonWidget = null
const getPageCommonWidget = () => {
	return currentPageCommonWidget
}
const setPageCommonWidget = (commonWidget) => {
	currentPageCommonWidget = commonWidget
}
const removePageCommonWidget = () => {
	setPageCommonWidget(null)
}
export default {
	getPageCommonWidget,
	setPageCommonWidget,
	removePageCommonWidget
}