const {prefix, token} = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');

let aops = {

	base_url: 'https://raw.githubusercontent.com/aops-bot',

	amc_12: {
		name: 'AMC_12',
		version: ['A','B'],
		year: { min: 2011, max: 2018 }, // years with stats
		problem: { min: 1, max: 25 }
	},

	getProblem(message) {
		let test = aops.amc_12.name;
		let year = 2011; // getRandom(aops.amc_12.year.min, aops.amc_12.year.max); // 2011-2018
		let version = 'A'; // aops.amc_12.version[getRandom(0, aops.amc_12.version.length - 1)]; // A-B
		let problem = getRandom(aops.amc_12.problem.min, aops.amc_12.problem.max); // 1-25
		let url = `${aops.base_url}/${test}/${version}/${year}`;
		
		aops.fetchStats(url, problem, message);
		message.channel.send(`${url}/Prob_${problem}.png`);
	},

	fetchStats(url, problem, message) {
		request(`${url}/stats.json`, (error, response, body) => {
			let stats = JSON.parse(body);
			let correct = stats[`${problem}`][stats[`${problem}`]["Answer"]];
			let reply = `**${correct}% of participants correctly answered this problem.**`;
			message.channel.send(reply);
		});
	},

	respond(message) {
		if (message.content.includes(prefix)) {
			console.log(message.content);
    		aops.getProblem(message);
		}
	}

};

// utility methods
let getRandom = (min, max) => Math.floor((Math.random() * (max - min)) + min);

// client config
client.on('ready', () => console.log('Ready >>'));
client.on('message', async message => aops.respond(message));
client.login(token);