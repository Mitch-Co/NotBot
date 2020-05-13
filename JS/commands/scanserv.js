module.exports = {
	name: 'scanserv',
    description: 'Scans all messages in a server',
    isAdmin: true,
    hidden: false,
	async execute(guild) {

        let serverJSON = {};
        let channelsJSON = [];

        serverJSON.id = guild.id.toString();

        let channelsObj = [];

        guild.channels.cache.forEach(channel => {
            channelsObj.push(channel);
        });

        for (const channel of channelsObj)
        {
            if(channel.type === "text")
            {
                let messagesObj = [];
                let channelJSON = {};
                let messagesJSON = [];

                messagesObj = await grabMessagesFromChan(channel);

                for (message of messagesObj)
                {
                    let messageJSON = {};
                    messageJSON.text = message.toString();
                    messagesJSON.push(messageJSON);
                }

                channelJSON.name = channel.toString();
                channelJSON.messages = messagesJSON;
                channelsJSON.push(channelJSON);
                break;
            }
        }

        serverJSON.channels = channelsJSON;

        return serverJSON;

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
                for (message of messages)
                {
                    toReturn.push(message);
                }
                if(lastID == msgArray[msgArray.length - 1].id.toString())
                {
                    breakflag = true;
                }
                lastID = msgArray[msgArray.length - 1].id.toString();
            }

        })
        .catch((err) => {
            breakflag = true;
        });

        if(breakflag === true)
        {
            break;
        }

    }
    console.log("DONE SCANNING " + channel.toString());
    return toReturn;
}