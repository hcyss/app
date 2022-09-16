import dayjs from 'dayjs'
/**
 * 时间戳格式化
 * @param {Number} timestamp
 * @param {String} format
 */
const formatTime = (timestamp, format) => {
	return dayjs(timestamp).format(format)
}
/**
 * 根据时间戳返回周几
 * @param {Number} dateTime
 */
const getWeekDay = (dateTime) => {
	if(dateTime == null) return ''
	return `周${"日一二三四五六".charAt(dayjs(dateTime).format('d'))}`
}
/**
 * 是否休息日（周六或周日默认为休息日）
 * @param {Number} dateTime
 */
const isOffWeekDay = (dateTime) => {
	let day = dayjs(dateTime).format('d')
	return day === '0' || day === '6'
}
/**
 * 将时间转换为时间戳
 * @param {String | Date} date
 */
const getTimestamp = (date) => {
	return dayjs(date).valueOf()
}
/**
 * 将时间戳格式为日期
 * @param {Number} timestamp
 */
const getDate = (timestamp) => {
	return dayjs(timestamp).format('YYYY-MM-DD')
}
/**
 * 将日期转换为起始时间戳
 * @param {String | Date} date
 */
const getStartTime = (date) => {
	return dayjs(dayjs(date).format('YYYY-MM-DD 00:00:00')).valueOf()	
}
/**
 * j将日期转换为结束时间戳
 * @param {String | Date} date
 */
const getEndTime = (date) => {
	return dayjs(dayjs(date).format('YYYY-MM-DD 23:59:59')).valueOf()
}

export default {
	getEndTime,
	getStartTime,
	getDate,
	getTimestamp,
	formatTime,
	getWeekDay,
	isOffWeekDay
}