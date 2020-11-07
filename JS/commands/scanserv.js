module.exports = {
	name: 'scanserv',
    description: 'Scans all messages in a server',
    args: "No arguments",
    isAdmin: true,
    hidden: true,
	async execute(commandMSG, guild) {

        // Abandon all hope, yee who come here
        // Searously, this is some really messy code, do not touch it unless you plan on refactoring it
        // I have a feeling discordJS did not want their API to be used in this way

        // If you are looking for the structure of the JSON server files, it is easier to just 

        let serverJSON = {};
        let channelsJSON = [];

        // Create server JSON object
        serverJSON.id = guild.id.toString();
        serverJSON.date = Date.now().toString();
        let channelsObj = [];

        // Scan all channels
        guild.channels.cache.forEach(channel => {
            channelsObj.push(channel);
        });
        try
        {
            // For each channel
            for (const channel of channelsObj)
            {
                // If text channel
                if(channel.type === "text")
                {
                    let channelJSON = {};
                    let messagesObj = [];
                    let messagesJSON = [];

                    // Scan messages from current channel
                    commandMSG.channel.send("SCANNING " + channel.toString());
                    messagesObj = await grabMessagesFromChan(channel);
                    
                    // For each message in returned array
                    for (const message of messagesObj)
                    {
                        // Form a message JSON for each message
                        let messageJSON = {};
                        messageJSON.text = message.content;
                        messageJSON.author = message.author.id.toString();
                        messageJSON.date = message.createdAt;

                        // Add a reactions JSON to each message
                        let reactionsJSON = [];
    
                        // Add each reaction JSON to reactionsJSON
                        // Each reaction JSON contains a reaction, and the people who have used said reaction 
                        message.reactions.cache.forEach(reaction => {
                            
                            let reactionJSON = {};
                            reactionJSON.name = reaction.emoji.toString();
                            reactionJSON.authors = [];

                            // Find the users who reacted with the current reaction (for some reason this is not included in the discordJS objects)
                            reaction.users.fetch()
                                .then((userList) => {
                                    userList.forEach(user => {
                                        let reactUserJSON = {};
                                        reactUserJSON.id = user.id.toString();
                                        reactionJSON.authors.push(reactUserJSON);
                                    });
                                });
                            reactionsJSON.push(reactionJSON);
                        });
                        messageJSON.reactions = reactionsJSON;
                        messagesJSON.push(messageJSON);
                    }
    
                    channelJSON.id = channel.id.toString();
                    channelJSON.messages = messagesJSON;
                    channelsJSON.push(channelJSON);
                }
            }
            serverJSON.channels = channelsJSON;

            commandMSG.channel.send("Scan Complete!");
            return serverJSON;
        }
        catch (error)
        {
            console.log(error);
            commandMSG.channel.send("AN ERROR HAS OCCURED WHILE SCANNING!");
            return;
        }

	},
};

// Grabs all messages from a discordJS channel
// NOTE: This function is a bit rough around the edges
// It works, but its a bit messy
async function grabMessagesFromChan(channel)
{
    let manager = channel.messages;

    // The max amount of messages to grab
    let absLimit = 1000000;

    // An array of discordJS message objects to return
    let toReturn = [];

    // How many scoops of 100 is nessisary to grab all of absLimit
    let rounds = absLimit/100;

    // A temp variable for storing 
    let lastID = "";

    for (let i = 0; i < rounds; i++) {
        
        let breakflag = false;
        
        let options = {
            limit:100
        };

        if(lastID.length > 0) {
            options.before = lastID;
        }

        // Fetch 100 messages
        await manager.fetch(options)
        .then(messages => {    

            let msgArray = messages.array();

            if(msgArray.length < 100 || msgArray == null)
            {
                // Push remaining messages
                messages.forEach((message)=> {                    
                    toReturn.push(message);
                });
                breakflag = true;
            }
            else
            {
                // Add each scanned message object to the toReturn array
                messages.forEach((message)=> {                    
                    toReturn.push(message);
                });
                
                // Break collection loop if the last collection ID was the same as the current collection
                if(lastID == msgArray[msgArray.length - 1].id.toString())
                {
                    breakflag = true;
                }
                
                // Update the position of the last collected message
                lastID = msgArray[msgArray.length - 1].id.toString();
            }

        })
        .catch((err) => {
            // If we run into any errors while collecting messages, break collection loop and log error
            breakflag = true;
            console.log(err);
        });

        if((i*100) % 10000 === 0)
        {
            console.log("   Scanned " + (i/10) + "K messages in " + channel.toString())
        }

        // Break when breakflag true
        if(breakflag === true)
        {
            break;
        }

    }
    console.log("DONE SCANNING " + channel.toString());
    return toReturn;
}