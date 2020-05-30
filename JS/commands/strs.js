module.exports = {
	name: "strs",
    description: "Finds how many times a phrase has been said by each user (CASE SENSITIVE)",
    args: "strs <string to search for>",
    isAdmin: false,
    hidden: false,
	async execute(message, args, client, serverJSON) {

        if(serverJSON == null)
        {
            message.channel.send("SERVER FILE NOT RECEIVED!");
            return;
        }

        // A list containing all users who have said a message on the server
        let userList = [];

        if(args.length === 0)
        {
            message.channel.send("Invalid arguments.");
            return;
        }

        // The search string requested by the user
        const qStr = message.content.substr(message.content.indexOf(' ')+1);

        if(qStr == "")
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

                let count = 0;
                let qSize = qStr.length;
                let mSize = chanMessage.text.length;

                // check all substrings of qStr size within the current message for qStr
                for(let i = 0;i <= mSize - qSize; i++)
                {
                    if(chanMessage.text.substring(i, qSize + i) === qStr)
                    {
                        count += 1;
                        i = i + qSize;
                    }
                }

                // Increase the users count by how many times they said qStr in their current message
                grabbedUser.count += count;
                
            }
        }

        // Text to be displayed back to the user
        let toReturn = "How many times have people said \"" + qStr + "\"?\n";

        // Sort userList based on count variable
        userList.sort(function(a, b){
            return b.count - a.count;
        });

        // Add each user who has said qStr to the return text
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
            message.channel.send("Return message too long, search less!");
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