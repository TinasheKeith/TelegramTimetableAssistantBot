const weather = require('yahoo-weather');

const main = async() => {
	let { item : { forecast: [ day ] } } = await weather('cape town', 'c');
	return day
};

module.exports = main;