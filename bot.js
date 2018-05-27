require('dotenv').config();

const Telegraf = require('telegraf');
const { Telegram } = require('telegraf');
const moment = require('moment');
const app = require('./app.js');

const bot = new Telegraf(process.env.BOTKEY); 
const client = new Telegram(process.env.BOTKEY);
const today = moment().format('dddd').toLowerCase();

bot.start((ctx) => {
	username = ctx.message.from.first_name;
	ctx.reply(`Hi there ${username}, how can I help?`, {
		reply_markup: {
			keyboard: [
				["What\'s my first class?"], ["What lecturers do I see today?"], ["What class should I be in right now?"]
			]
		}
	});
});

bot.hears("What\'s my first class?", ctx => {
	const theClass = app.getFirstClass(today);
	if(theClass !== null) {
		ctx.reply(`You have ${theClass.subject} with ${theClass.lecturer} in room ${theClass.room} at ${theClass.start}`);		
	} else {
		ctx.reply(`You don\'t seem to have any classes today`);
	}
});

bot.hears("What lecturers do I see today?", ctx => {
	const lecturers = app.getTodayLecturers(today);
	ctx.reply(`Today you will see ${lecturers}`);
});

bot.hears("What class should I be in right now?", ctx => {
	let currClass = app.getCurrentClass(today, moment().hour(), moment().minute());
	if(currClass.room === null) {
		ctx.reply('You don\'t seem to have a class right now');
	} else {
		ctx.reply(`You should be in room ${currClass.room} with ${currClass.lecturer} which started at ${currClass.start} and ends at ${currClass.end}`);		
	}
});

bot.startPolling();
