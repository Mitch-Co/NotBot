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
    
    // Lock IO and load server
    ioLock = true;   
    serverArray = [];
    serverArray = await client.commands.get("loadserv").execute(fs);
    
    // Initialize cashe array for quick response times after first load
    // NOTE: As of current version, Cashe is not used by any command
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
    
    // If the command does not exist, stop
    if(commandToRun == null)
    {
        message.channel.send("This command is not valid, to list valid commands, use `" + botPrefix + "help`.");
        return;
    }


    try
    {
        // If the command is admin-only
        if(commandToRun.isAdmin)
        {
            // And the user has admin access
            if(isAdmin(message.author))
            {
                // Execute command as admin
                switch(commandString)
                {
                    // Scan current server and convert it to JSON object, add it to server list
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
                    
                    // Save server JSONs to file
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

                    // Load server JSONs from file
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
                    
                    // Finds a users most popular words
                    case "popword":
                        commandToRun.execute(message, grabServerJSON(message.guild));
                        break;
                }

            }
            else
            {
                message.channel.send("This is a " + botMaster + " only command!");
            }
        }
        // Execute non-admin commands
        else
        {
            switch(commandString)
            {
                // Help command
                case "help":
                    commandToRun.execute(message, args, client);
                    break;

                // Search for a word in server messages
                case "word":
                    commandToRun.execute(message, args, client, grabServerJSON(message.guild));
                    break;
                
                // Serch for a substring in server messages
                case "strs":
                    commandToRun.execute(message, args, client, grabServerJSON(message.guild));
                    break;
                case "stru":
                    commandToRun.execute(message, args, client, grabServerJSON(message.guild));
                    break;

                case "reaction":
                    commandToRun.execute(message, args, client, grabServerJSON(message.guild));
                    break;
                case "reactionr":
                    commandToRun.execute(message, args, client, grabServerJSON(message.guild));
                    break;
            }
        }
    }
    // Catches any other uncaught error in commands
    catch (err)
    {
        message.channel.send("An error has occured while trying to run the command!");
        console.error(err);
    }
    
}

// Deletes cashe and reinitializes it
function resetCashe()
{
    cashe = [];
    
    for(server in serverArray)
    {
        let serverCashe = {};
        serverCashe.id = server.id;
    }
}

// Grabs server from global JSON given a discordJS server object
function grabServerJSON(serverObj)
{
    for(server of serverArray)
    {
        if(server.id === serverObj.id.toString())
        {
            return server;
        }
    }
    return null;
}
// Grabs server from global JSON cashe given a discordJS server object
function grabServerCashe(serverObj)
{
    for(server of cashe)
    {
        if(server.id === serverObj.id.toString())
        {
            return server;
        }
    }
    return null;
}
