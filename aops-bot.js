const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');

let aops = {

	base_url: 'https://raw.githubusercontent.com/aops-bot',
	sol_url: 'https://artofproblemsolving.com/wiki/index.php?title=',

	// read external config - problem updates require service worker restart
	init() {
		request(`${aops.base_url}/AMC_12/master/config.json`, (error, response, body) => {
			aops.config = JSON.parse(body);
			console.log('Ready >>');
		});
	},

	getProblem(message) {
		let test = aops.config.name;
		let year = getRandom(aops.config.year.min, aops.config.year.max); // 2011-2018
		let version = aops.config.version[getRandom(0, aops.config.version.length - 1)]; // A-B
		let problem = getRandom(aops.config.problem.min, aops.config.problem.max); // 1-25
		let url = `${aops.base_url}/${test}/${version}/${year}`;
		
		aops.fetchStats(url, problem, message);
		message.channel.send(`${url}/Prob_${problem}.png`);

		let solution = 
		`*View solution:*\n<${aops.sol_url}${year}_${test}${version}_Problems/Problem_${problem}>`;
		message.channel.send(solution);
	},

	// get stats for the problem
	fetchStats(url, problem, message) {
		request(`${url}/stats.json`, (error, response, body) => {
			let stats = JSON.parse(body);
			let correct = stats[`${problem}`][stats[`${problem}`]["Answer"]];
			let statsInfo = `**${correct}% of participants correctly answered this problem.**`;
			
			message.channel.send(statsInfo);
		});
	},

	respond(message) {
		if (message.content.includes(prefix)) {
			console.log(message.content);
    		aops.getProblem(message);
		}
	}

};

// generate random integer between min & max inclusive
let getRandom = (min, max) => Math.floor((Math.random() * (max - min + 1)) + min);

// client config
client.on('ready', () => aops.init());
client.on('message', async message => aops.respond(message));
client.login(token);