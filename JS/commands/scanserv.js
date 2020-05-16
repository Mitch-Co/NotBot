module.exports = {
	name: 'scanserv',
    description: 'Scans all messages in a server',
    isAdmin: true,
    hidden: false,
	async execute(commandMSG, guild) {

        let serverJSON = {};
        let channelsJSON = [];

        serverJSON.id = guild.id.toString();

        let channelsObj = [];

        guild.channels.cache.forEach(channel => {
            channelsObj.push(channel);
        });
        try
        {
            for (const channel of channelsObj)
            {
                if(channel.type === "text")
                {
                    let messagesObj = [];
                    let channelJSON = {};
                    let messagesJSON = [];
                    messagesObj = await grabMessagesFromChan(channel);
                    for (const message of messagesObj)
                    {
                        let messageJSON = {};
                        messageJSON.text = message.content;
                        messageJSON.author = message.author.id.toString();
                        messageJSON.date = message.createdAt;
                        let reactionsJSON = [];
    
                        message.reactions.cache.forEach(reaction => {
                            
                            let reactionJSON = {};
                            reactionJSON.name = reaction.emoji.toString();
                            reactionJSON.authors = [];
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

async function grabMessagesFromChan(channel)
{
    let manager = channel.messages;
    let absLimit = 100000;
    let toReturn = [];

    let rounds = absLimit/100;
    let lastID = "";

    for (let i = 0; i < rounds; i++) {
        
        let breakflag = false;
        let options;

        if(lastID.length > 0) {
            options = {
                limit:100,
                before:lastID,
            }
        }
        else
        {
            options = {
                limit:100,
            }
        }
        await manager.fetch(options)
        .then(messages => {
            let msgArray = messages.array();
            if(msgArray.length < 100 || msgArray == null)
            {
                breakflag = true;
            }
            else
            {
                messages.forEach((message)=> {                    
                    toReturn.push(message);
                });

                if(lastID == msgArray[msgArray.length - 1].id.toString())
                {
                    breakflag = true;
                }
                lastID = msgArray[msgArray.length - 1].id.toString();
            }

        })
        .catch((err) => {
            breakflag = true;
            console.log(err);
        });

        if(breakflag === true)
        {
            break;
        }

    }
    console.log("DONE SCANNING " + channel.toString());
    return toReturn;
}