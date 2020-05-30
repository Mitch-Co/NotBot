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

        // For all messages in a server
        for(channel of serverJSON.channels)
        {
            for(chanMessage of channel.messages)
            {
                // Find who said the message in the userList
                let grabbedUser = grabUser(chanMessage.author, userList);

                // If they do not exist, make them and put them in the userList
                if(grabbedUser === null)
                {
                    grabbedUser = makeNewUser(chanMessage.author);
                    userList.push(grabbedUser);
                }

                // Break the message up by separating by either spaces or newlines
                let splitString = chanMessage.text.split(/ +|\n/);

                // For each word of the message
                for(word of splitString)
                {
                    // Remove anything at the start or end of the word (punctuation, etc)
                    let processedWord = word.match(/\w+/);
                    
                    if(processedWord != null && processedWord[0].toLowerCase() === qWord)
                    {
                        grabbedUser.count += 1;
                    }
                }
            }
        }

        let toReturn = "How many times have people said " + qWord + "?\n";

        // Sort the userList based on its count variables, from highest to lowest
        userList.sort(function(a, b){
            return b.count - a.count;
        });

        // Add each user who has said qWord to the return text
        for(user of userList)
        {
            if(user.count > 0)
            {
                let userOBJ = await client.users.fetch(user.id);
                toReturn += userOBJ.username + ": " + user.count.toString() + "\n";
            }
        }

        // Incase the return text is too long to be displayed in discord
        if(toReturn.length > 2000)
        {
            message.channel.send("Too damn long, search less!");
            return;
        }
        message.channel.send(toReturn);
    },
};

// Generates and returns a new user object
function makeNewUser(id) {
    let user = {};
    user.id = id;
    user.count = 0;
    return user;
}

// Linear searches the userList for a user
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