module.exports = {
	name: "reaction",
    description: "Finds how many times people have used reactions",
    args: "reaction <reaction to search for>",
    isAdmin: false,
    hidden: false,
	async execute(message, args, client, serverJSON) {
        
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

        const qEmoji = message.content.substr(message.content.indexOf(' ')+1).toLowerCase();

        for(channel of serverJSON.channels)
        {
            for(chanMessage of channel.messages)
            {
                for(reaction of chanMessage.reactions)
                {
                    if(reaction.name == qEmoji)
                    {
                        for(author of reaction.authors)
                        {
                            let grabbedUser = grabUser(author.id, userList);
                            if(grabbedUser === null)
                            {
                                grabbedUser = makeNewUser(author.id);
                                userList.push(grabbedUser);
                            }
                            grabbedUser.count += 1;
                        }
                    }
                }
            }
        }
        if(userList.length <= 0)
        {
            message.channel.send("Emoji does not exist, or has not been used in a reaction!");
            return;
        }

        let toReturn = "Who has used the most \"" + qEmoji + "\" reaction?\n";

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
            message.channel.send("Return message too long!");
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