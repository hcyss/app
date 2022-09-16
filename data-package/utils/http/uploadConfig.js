/**
 * 配置参数
 */
const UploadConfig = {
	url: null, // 完整链接
	filePath: null, // 文件路径
	name: null, //
	header: {}, // 请求头  
	formData: {}, // 表单内容
	success: null, // 成功回调
	fail: null, // 失败回调
	complete: null, // 完成回调
	baseUrl: null, // 基地址
	methodUrl: null, // api方法链接
	requestId: null, // 请求id
	isShowMask: false // 是否显示遮罩
}

export default UploadConfig 