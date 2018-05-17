const moment = require('moment');
const table = require('./table');
const _ = require('lodash');
const timediff = require('timediff');
const week = table.week;

const getPeriod = period => {
	if(period >= 1) {
		return period - 1;
	} 
	return null;
}

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

const getFirstClass = day => {
	const times = fetchAll(day);
	for(let i = 0; i < times.length; i++) {
		if(times[i] !== null) {
			return invokeDay(day, i);
		} 
	}
	return null;
}

const getCurrentClass = day => {
	let currentClass = null; 	
	const currentHour = moment().hour();
	const currentMinutes = moment().minute();
	const startTimes = _.uniq(getStartTimes(day));
	const endTimes = _.uniq(getEndTimes(day));
	const startHours = startTimes.map(val => val.substring(0, 2));
	const startMinutes = startTimes.map(val => val.substring(3, 5));
	
	const getClass = (day, hour) => {
		let fetchEverything = day => week[day].map(val => val.start);
		let allStartTimes = fetchEverything(day);
		for(let i = 0; i < allStartTimes.length; i++) {
			if(allStartTimes[i] !== null) {
				if(allStartTimes[i].substring(0, 2) == hour.toString()) {
					currentClass = invokeDay(day, i);
					nextClass = i + 1;
					break;
				}
			}
		}
	}
	getClass(day, 11);
}

// console.log(getCurrentClass(today, 10));

const getNextClass = (day) => {
	getCurrentClass(day);
	return fetchAll(day)[nextClass];
} 

module.exports = {
	week,
	today, 
	nextClass, 	
	getPeriod,
	periodsToday, 
	getStartTimes, 
	fetchAll, 
	getEndTimes, 
	getTodayLecturers, 
	getFirstClass, 
	getCurrentClass
};

