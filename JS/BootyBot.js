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

//Create places to manage server data
let serverArray = [];
let miniServerArray = [];

// Enable next line if performance time is required
//const {PerformanceObserver, performance} = require('perf_hooks');

client.login(token);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

client.on("message", message => {
    if(isCommand(message))
    {
        runCommand(message);
    } 
});

function isCommand(message)
{
    if(!message.content.startsWith(botPrefix) || message.author.bot)
    {
      return false;
    }
    return true;
}

function isAdmin(user)
{
    if(user.tag === botMaster)
    {
        return true;
    }
    return false;
}

async function runCommand(message)
{
    const args = message.content.slice(botPrefix.length).split(/ +/);
    const commandString = args.shift().toLowerCase();
    let commandToRun = client.commands.get(commandString);
    
    if(commandToRun == null)
    {
        message.channel.send("This command is not valid, to list valid commands, use " + botPrefix + "help ");
        return;
    }


    try
    {
        if(commandToRun.isAdmin)
        {
            if(isAdmin(message.author))
            {
                // Admin Commands
                switch(commandString)
                {
                    case "scanserv":
                        commandToRun.execute();
                        break;
                }

            }
            else
            {
                message.channel.send("This is a " + botMaster + " only command!");
            }
        }
        else
        {
            // Non Admin Commands
            switch(commandString)
            {
                case "help":
                    commandToRun.execute(message, client);
                    break;
            }
        }
    }
    catch (err)
    {
        message.channel.send("An error has occured while trying to run the command!");
        console.error(error);
    }
    
}

