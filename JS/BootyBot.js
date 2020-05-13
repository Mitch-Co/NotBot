const fs = require('fs');
const Discord = require('discord.js');
const FileMan = require('./FileMan.js');

// Bot token and info loaded
const {botPrefix, token, botMaster} = require("../assets/config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Commands loaded
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith('.js'));
for (const file of commandFiles) 
{
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

//Create a new File Manager
let manager = new FileMan(fs);

// Enable next line if performance time is required
//const {PerformanceObserver, performance} = require('perf_hooks');

client.login(token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
