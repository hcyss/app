<template>
	<view class="container">
		<u-transition show mode="fade">
		<view class="page">
			<navbar :params="navbarParams"></navbar>
			<view class="content">
				<details-item ref="name" item-key="name" title="姓名" :itemValue="details.name" edit bottomLine @click="onClickItem"></details-item>
				<details-item ref="sex" item-key="sex" title="性别" :itemValue="details.sex" value-name="name" edit  bottomLine @click="onClickItem"></details-item>
				<details-item ref="age" item-key="age" title="年龄" :itemValue="details.age" edit bottomLine @click="onClickItem"></details-item>
				<details-item ref="like" item-key="like" title="爱好" :itemValue="details.like" edit value-name="name" bottomLine @click="onClickItem"></details-item>
				<details-item ref="account" item-key="account" title="帐号" :itemValue="details.account" bottomLine @click="onClickItem"></details-item>
				<details-item ref="password" item-key="password" title="密码" :itemValue="details.password" useMask="#" edit bottomLine @click="onClickItem"></details-item>
				<details-item ref="birthday" item-key="birthday" title="生日" :itemValue="details.birthday" :valueFormat="birthdayFormat" edit bottomLine @click="onClickItem"></details-item>
				<details-item ref="registTime" item-key="registTime" title="注册时间" :itemValue="details.registTime" edit bottomLine @click="onClickItem"></details-item>
				<details-item ref="from" item-key="from" title="来自" :itemValue="details.from" value-name="title" edit bottomLine @click="onClickItem"></details-item>
				<details-item ref="street" item-key="street" title="归属街道" :itemValue="details.street" value-name="title" edit bottomLine @click="onClickItem"></details-item>
				<details-item ref="desc" item-key="desc" title="描述" :itemValue="details.desc" wrap edit bottomLine @click="onClickItem"></details-item>
				<details-item ref="callActionSheet" item-key="callActionSheet" title="演示调用actionSheet" value-name="name" :itemValue="selectAction" placeholder="请点餐..." :edit="selectAction!=null" icon="close-circle" iconColor="#aaa" iconSize="30rpx" useIconClick @iconClick="onClearEat" bottomLine @click="onClickItem"></details-item>
			</view>
		</view>
		</u-transition>
		<common-widget ref="commonWidget" :visable="pageVisable" @popupSelect="onSyncDetails"></common-widget>
	</view>
</template>

<script>
	import Navbar from '@/data-package/components/nav-bar.vue' // 导航栏
	import CommonWidget from '@/data-package/components/common-widget.vue' // 封装了 对话框，提示，加载动画等通用组件
	import commonPage from '@/data-package/mixins/common-page.js' // 配合通用组件的混入文件
	import DetailsItem from '@/data-package/components/details-item.vue' // 详情项
	export default {
		components: {Navbar, CommonWidget, DetailsItem},
		mixins:[commonPage],
		data() {
			return {
				navbarParams: {
					title: '详情'
				},
				details: {
					name: '张三',
					sex: {id:1, name:'女'},
					age: 18,
					account: "admin",
					password: "123456",
					like: [{id:1, name:'爬山'},{id:2, name:'游泳'},{id:3, name: '跑步'},{id:4, name:'吃饭'},{id:5, name:'睡觉'},{id:6, name: '打豆豆'},{id:7, name:'读书'},{id:8,name:'看报'},{id:9, name:'画画'},{id:10,name:'写作'}],
					desc: "本人诚实,热情,具有良好的人际关系,极富创造力与创新意识,具有较强的逻辑思维和组织协调能力,对事情认真,负责,有很强的责任心和团队精神,为人自信,乐观,处事冷静。",
					birthday: 1661011185000,
					registTime: "2020-12-03 12:21:03",
					from: [{code: '100', title: '广东省'},{code: '333', title: '广州市'},{code:'3333', title: '海珠区'}],//[{code: '010', title:'北京'}],
					street: {code: '10031', title: '江南中街道'}
				},
				selectAction: null
			}
		},
		methods: {
			onClearEat(e) {
				this.selectAction = null
			},
			birthdayFormat(birthdayTimestamp) {
				// 数据格式化显示处理
				return this.$dayjs(birthdayTimestamp).format('YYYY年MM月DD日')
			},
			getCascadeData(conlumnCount, columnIndex, index, item, allItem) {
				// console.log("getCascadeData", columnIndex, index, JSON.stringify(item), JSON.stringify(allItem))
				// 进行串联请求，代码可忽略。只需知道，当前操作是根据变化列的选中项，去获取下一列到最后列的数据即可，而每列的缺省选中项，是该列的第一个选项。
				return new Promise(resolve => {
					setTimeout(async () => {
						let appendList = []
						let defItem  = item // 上一个item,缺省值是列表的第一个item 
						for(let i = columnIndex; i < conlumnCount - 1; i++) {
							let list = []
							if (defItem != null) {
								list = await this.loadAreaList(i, 0, defItem)
								if (list.length > 0) {
									defItem = list[0]
								} else {
									defItem = null
								}
							}
							appendList.push(list)
						}
						// console.log(JSON.stringify(appendList))
						resolve(appendList)	
					},1000)
				})
			},
			loadAreaList(columnIndex, index, item) {
				// 模仿请求，具体代码可以忽略，无参考意义，入参也不需要columnIndex, index
				return new Promise(async resolve => {
						let res
						console.log("columnIndex = ", columnIndex);
						if (columnIndex === 0) {
							if (index === 0) {
								res = {code:1, data: [{code:'1111', title: '上海市'}, {code:'1112', title: '重庆市'}, {code:'1113', title: '天津市'}], message: '成功'}
							} else
							if (index === 1) {
								res = {code:1, data: [{code:'1111', title: '广州市'}, {code:'1112', title: '佛山市'}, {code:'1113', title: '增城市'}, {code:'1114', title: '清远市'}], message: '成功'}
							} else 
							if (index === 2) {
								res = {code:1, data: [{code:'2111', title: '桂林市'}, {code:'2112', title: '南宁市'}, {code:'2113', title: '柳州市'}], message: '成功'}
							}
							
						} else
						if (columnIndex === 1) {
							if (index === 0) {
								res = {code:1, data: [{code:'1111', title: '海珠区'}, {code:'1112', title: '越秀区'}], message: '成功'}
							} else
							if (index === 1) {
								res = {code:1, data: [{code:'1111', title: '东山区'}, {code:'1112', title: '荔湾区'}], message: '成功'}
							} else 
							if (index === 2) {
								res = {code:1, data: [{code:'2111', title: '白云区'}, {code:'2112', title: '黄埔区'}], message: '成功'}
							}
						}
						console.log("loadAreaList");
						if (res.code === 1) {
							resolve(res.data)
						} else {
							resolve([])
						}
				})
			},
			onClickItem(data) {
				// 点击details-item
				let {edit, title, key, value } = data
				// console.log( "是否编辑 = ", edit, ", title = ", title,", key = ", key, ", value = ", value )
				if( key === 'name') { // 这里就具体情况具体判断了，例如名字是输入框的，所以就调用带input框的popup
					this.$refs.commonWidget.showInput({
						data, // 展示的数据
						popupSelectMethod: (data) => {
							// 定义此选中事件，则优先回调此事件，不再执行common-widget 的 popupSelect 事件
							// console.log('popupSelectMethod', data)
							this.details[data.key] = data.value
						}
					})
				} else
				if (key === 'sex') {
					this.$refs.commonWidget.showSingleSelect({
						data, // 展示的数据，可理解为选中的数据
						dataList: [{id:1, name:'女'}, {id:2, name:'男'}, {id:3, name: '未知'}] ,// 可选的数据，一般是通过请求拿到的最全的可选数据
						labelName: 'name', // 展示数据的内容字段名
						keyName: 'id' // 展示数据的唯一标识字段名
					})
				} else
				if (key === 'age') {
					this.$refs.commonWidget.showNumber({
						data, // 展示的数据
						min: 1, // 下限边界
						max: 100 // 上限边界
					})
				} else 
				if (key === 'password') {
					this.$refs.commonWidget.showPassword({
						data, // 展示的数据
						txtLength: 16 // 文本许可最大长度
					})
				} else 
				if (key === 'like') {
					this.$refs.commonWidget.showMultiSelect({
						data, // 展示的数据，可理解为选中的数据
						dataList: [
							{id:0, name:'考试'}, 
							{id:1, name:'爬山'},
							{id:2, name:'游泳'},
							{id:3, name: '跑步'},
							{id:4, name:'吃饭'},
							{id:5, name:'睡觉'},
							{id:6, name: '打豆豆'},
							{id:7, name:'读书'},
							{id:8,name:'看报'},
							{id:9, name:'画画'},
							{id:10,name:'写作'},
						], // 可选的数据，一般是通过请求拿到的最全的可选数据
						labelName: 'name', // 展示数据的内容字段名
						keyName: 'id' // 展示数据的唯一标识字段名
					})
				} else 
				if (key === 'desc') {
					this.$refs.commonWidget.showTextArea({
						data, // 展示的数据
					})
				} else 
				if (key === 'birthday') {
					this.$refs.commonWidget.showDate({
						data, // 展示的数据，注意：data.value 必须是时间戳，请传入前做好转换
						min: this.$dayjs().subtract(100, 'year').valueOf(),  // 日期可选的的下限（时间戳）
						max: this.$dayjs().valueOf() // 日期可选的上限（时间戳）
					})
				} else 
				if (key === 'registTime') {
					data.value = this.$dayjs(data.value).valueOf() // 日期转时间戳
					this.$refs.commonWidget.showDateTime({
						data, // 展示的数据，注意：data.value 必须是时间戳，请传入前做好转换
						min: this.$dayjs().subtract(100, 'year').valueOf(),  // 日期可选的的下限（时间戳）
						max: this.$dayjs().valueOf(), // 日期可选的上限（时间戳）
						valueFormatMethod: (value) => { 
							return this.$dayjs(value).format('YYYY-MM-DD HH:mm:ss')} // 返回的是时间戳，所以自定义格式化处理，返回格式化后的字符串，与数据来源格式一致。
					})
				} else 
				if (key === 'from') {
					// 三层列表的级联使用演示
					this.$refs.commonWidget.showCascade({
						data, // 展示的数据，其中的 value，是一个对象，或者是一个对象数组 
						keyName: 'code', // 展示数据的唯一标识字段名
						labelName: 'title',  // 展示数据的内容字段名
						dataList: [[{code: '010', title: '北京'}, {code: '100', title: '广东省'}, {code: '101', title: '广西省'}],[{code:'444', title: '清远市'}, {code:'333', title: '广州市'}, {code:'444', title: '惠州市'}],[{code:'1234', title: '越秀区'},{code:'2222', title: '荔湾区'},{code:'3333', title: '海珠区'}]], // 级联数据，一维（内部会转为二维）或 二维数组，数据层级范围 1 ~ 3，初始化提供数据是每一级的第一个选项的数据（[[第一层...],[第二层...],[第三层...]]），这些数据来自于提前请求
						cascadeMethod: this.getCascadeData // 级联获取下级数据的方法 
					})
				} else 
				if (key === 'street') {
					// 只有一层列表的使用演示
					this.$refs.commonWidget.showCascade({
						data, // 展示的数据，其中的 value，是一个对象，或者是一个对象数组 
						keyName: 'code', // 展示数据的唯一标识字段名
						labelName: 'title',  // 展示数据的内容字段名
						dataList: [{code: '99', title: '广卫街道'}, {code: '10031', title: '江南中街道'}, {code: '101', title: '鹤龙街道'}], // 级联数据，一维（内部会转为二维）或 二维数组，数据层级范围 1 ~ 3，初始化提供数据是每一级的第一个选项的数据（[[第一层...],[第二层...],[第三层...]]），这些数据来自于提前请求
					})
				} else 
				if (key === 'callActionSheet') {
					// 调用actionSheet演示
					this.$refs.commonWidget.showActionSheet({
						title: "请问想吃什么",
						list: [
							{
								id: 1,
								name: '吃饭' // actionSheet的展示字段名 name 是固定值，无法设置labeName来动态映射字段名
							},{
								id: 2,
								name: '吃粥'
							},{
								id: 3,
								name: '吃米粉'
							}
						],
						cancelText: '取消', 
						selectMethod: (e) => {
							// 选中的回调
							this.selectAction = e
						}
					})
				}
			},
			onSyncDetails(data) {
				// 修改完成，进行更新详情数据，并更新到details-item
				// console.log("onSyncDetails", JSON.stringify(data))
				this.details[data.key] = data.value
			}
		},
		mounted() {}
	}
</script>

<style lang="scss" scoped>
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
.content {
	width: 100%;
}
</style>
