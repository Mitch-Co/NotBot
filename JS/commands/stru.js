module.exports = {
	name: "stru",
    description: "Finds how many times a phrase has been said by each user (CASE INSENSITIVE)",
    args: "stru <string to search for>",
    isAdmin: false,
    hidden: false,
	async execute(message, args, client, serverJSON) {

        // NOTE: This function operates the same as strs, it just compares strings case insensitively
        // As such, the code is uncommented
        
        if(serverJSON == null)
        {
            message.channel.send("SERVER FILE NOT RECEIVED!");
            return;
        }
        let userList = [];

        if(args.length === 0)
        {
            message.channel.send("Invalid arguments.");
            return;
        }

        const qStr = message.content.substr(message.content.indexOf(' ')+1).toLowerCase();

        if(qStr == "")
        {
            message.channel.send("Invalid arguments.");
            return;
        }

        for(channel of serverJSON.channels)
        {
            for(chanMessage of channel.messages)
            {
                let grabbedUser = grabUser(chanMessage.author, userList);
                if(grabbedUser === null)
                {
                    grabbedUser = makeNewUser(chanMessage.author);
                    userList.push(grabbedUser);
                }

                let count = 0;
                let qSize = qStr.length;
                let mSize = chanMessage.text.length;

                for(let i = 0;i <= mSize - qSize; i++)
                {
                    if(chanMessage.text.substring(i, qSize + i).toLowerCase() === qStr)
                    {
                        count += 1;
                        i = i + qSize;
                    }
                }

                grabbedUser.count += count;
                
            }
        }

        let toReturn = "How many times have people said \"" + qStr + "\"?\n";

        userList.sort(function(a, b){
            return b.count - a.count;
        });

        for(user of userList)
        {
            if(user.count > 0)
            {
                let userOBJ = await client.users.fetch(user.id);
                toReturn += userOBJ.username + ": " + user.count.toString() + "\n";
            }
        }

        if(toReturn.length > 2000)
        {
            message.channel.send("Return message too long, search less!");
            return;
        }
        message.channel.send(toReturn);
    },
};

function makeNewUser(id) {
    let user = {};
    user.id = id;
    user.count = 0;
    return user;
}

function grabUser(id, userList) {

    for(user of userList)
    {
        if (user.id === id)
        {
            return user;
        }
    }
    return null;
}