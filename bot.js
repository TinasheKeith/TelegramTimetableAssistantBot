require('dotenv').config();

const Telegraf = require('telegraf');
const { Telegram } = require('telegraf');
const moment = require('moment');
const cron = require('node-cron');
const weather = require('yahoo-weather');
const NewsAPI = require('newsapi');

const app = require('./app.js');
const forecast = require("./weather");

const bot = new Telegraf(process.env.BOTKEY); 
const client = new Telegram(process.env.BOTKEY);
const newsapi = new NewsAPI('d83abda677934c9d8601b0db7fae4d06');

const allowAccess = false;
let chatId;

const today = moment().format('dddd').toLowerCase();
let sendArt = false;
cron.schedule('55 19 * * 1-5', async() => {
	let day = await forecast();
	client.sendMessage(343476900, `Good morning! Here is your rundown for today 🚀 \n
Weather first 🌞\n${day.text}\nThe high today is ${day.high}°C and the low will be ${day.low}°C\n
Your first class today will be at ${app.getFirstClass(today).start} with ${app.getFirstClass(today).lecturer} in room ${app.getFirstClass(today).room} 
I'm trying to fetch some articles for your commute, one moment...
	`);

	newsapi.v2.topHeadlines({
		sources: 'the-verge, google-news, wired', 
		language: 'en'
	}).then(response => {
		client.sendMessage(343476900,`Here are a few articles for your commute!\n`);
		client.sendMessage(343476900, `${response.articles[0].url}`);
		client.sendMessage(343476900, `${response.articles[1].url}`);
		client.sendMessage(343476900, `${response.articles[2].url}`);
	});
});

bot.start((ctx) => {
	chatId = ctx.update.message.chat.id;
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

console.log('bot running...')
bot.startPolling();