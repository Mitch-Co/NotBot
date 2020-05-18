module.exports = {
	name: "word",
    description: "Finds how many times a word has been said by each user",
    args: "word <word to scan for> ",
    isAdmin: false,
    hidden: false,
	async execute(message, args, client, serverJSON) {

        if(serverJSON == null)
        {
            message.channel.send("SERVER FILE NOT RECEIVED!");
            return;
        }
        let userList = [];
        let qWord;

        if(args.length == 1)
        {
            qWord = args[0].toLowerCase();
        }
        else
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

                let splitString = chanMessage.text.split(/ +/);
                for(word of splitString)
                {
                    let processedWord = word.match(/\w+/);
                    
                    if(processedWord != null && processedWord[0].toLowerCase() === qWord)
                    {
                        grabbedUser.count += 1;
                    }
                }
            }
        }

        let toReturn = "How many times have people said " + qWord + "?\n";

        for(user of userList)
        {
            if(user.count > 0)
            {
                let userOBJ = await client.users.fetch(user.id);
                toReturn += userOBJ.username + ": " + user.count.toString() + "\n";
            }
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