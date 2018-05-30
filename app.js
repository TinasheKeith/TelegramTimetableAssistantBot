const moment = require('moment');
const table = require('./table');
const _ = require('lodash');
const timediff = require('timediff');
const week = table.week;


let today = moment().format('dddd').toLowerCase();
let nextClass;

const periodsToday = (day) => week[day].map(val => val);

const getStartTimes = day => week[day].map(val => val.start).filter(val => val != null);
const fetchAll = day => week[day].map(val => val.start);
const getEndTimes = day => week[day].map(val => val.end).filter(val => val != null);
const getTodayLecturers = (day) => _.uniq(week[day].map(val => val.lecturer).filter(val => val != null));

const invokeDay = (day, period) => {
	switch(day) {
		case 'monday': return week.monday[period];
		case 'tuesday': return week.tuesday[period];
		case 'wednesday': return week.wednesday[period];
		case 'thursday': return week.thursday[period];
		case 'friday': return week.friday[period];
		default: return null;
	}
}

const getCurrentPeriod = (hour, minute) => {
	switch(hour) {
		case 8: return invokeDay(day, 1); break;
		case 9: 
			if(minute >= 10) {
				return 1;
			} else {
				return 2;
			}
		case 10:
			if(minute < 40) {
				return 3;
			} else {
				return 4;
			}
		case 11:
			if(minute > 25) {
				return 4;
			} else {
				return 5;
			}
		case 12: 
			if(minute < 55) {
				return 6;
			} else {
				return null;
			}
		case 13:
			if(minute < 45) {
				return null;
			} else {
				return 7;
			} 
		case 14: 
			return 8;	
	}
}

const getCurrentClass = (day, hour, minute) => {
	return invokeDay(day, getCurrentPeriod(hour, minute));
}

const getFirstClass = day => {
	const times = fetchAll(day);
	for(let i = 0; i < times.length; i++) {
		if(times[i] !== null) {
			return invokeDay(day, i);
		} 
	}
	return null;
}

module.exports = {
	week,
	today, 
	nextClass, 	
	periodsToday, 
	getStartTimes, 
	fetchAll, 
	getEndTimes, 
	getTodayLecturers, 
	getFirstClass, 
	getCurrentPeriod, 
	getCurrentClass
};