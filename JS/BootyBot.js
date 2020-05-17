const fs = require('fs');
const Discord = require('discord.js');

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

//Create places to manage server data
let serverArray = [];
let cashe = [];

let ioLock = false;
// Enable next line if performance time is required
//const {PerformanceObserver, performance} = require('perf_hooks');

client.login(token);

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    ioLock = true;   
    serverArray = [];
    serverArray = await client.commands.get("loadserv").execute(fs);
    
    // Initialize cashe array for quick response times after first load
    resetCashe();
    ioLock = false;

    console.log("Server files loaded. All systems operational.");
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
        message.channel.send("This command is not valid, to list valid commands, use `" + botPrefix + "help`.");
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
                        if(ioLock === true)
                        {
                            message.channel.send("IO OPERATION PENDING: PLEASE WAIT!");
                            break;
                        }
                        ioLock = true;
                        let serverJSON = await commandToRun.execute(message, message.guild);
                        serverArray.push(serverJSON);
                        ioLock = false;
                        break;
                    case "saveserv":
                        if(ioLock === true)
                        {
                            message.channel.send("IO OPERATION PENDING: PLEASE WAIT!");
                            break;
                        }
                        ioLock = true;

                        commandToRun.execute(message, serverArray, fs);

                        ioLock = false;
                        break;
                    case "loadserv":
                        if(ioLock === true)
                        {
                            message.channel.send("IO OPERATION PENDING: PLEASE WAIT!");
                            break;
                        }
                        ioLock = true;
                        
                        serverArray = [];
                        serverArray = await commandToRun.execute(fs);

                        ioLock = false;
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
                    commandToRun.execute(message, args, client);
                    break;
            }
        }
    }
    catch (err)
    {
        message.channel.send("An error has occured while trying to run the command!");
        console.error(err);
    }
    
}

function resetCashe()
{
    cashe = [];
    
    for(server in serverArray)
    {
        let serverCashe = {};
        serverCashe.id = server.id;
    }
}

function grabServerJSON(serverObj)
{
    for(server in serverArray)
    {
        if(server.id === serverObj.id.toString())
        {
            return server;
        }
    }
    return null;
}

function grabServerCashe(serverObj)
{
    for(server in cashe)
    {
        if(server.id === serverObj.id.toString())
        {
            return server;
        }
    }
    return null;
}
