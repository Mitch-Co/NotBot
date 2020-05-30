module.exports = {
	name: "saveserv",
    description: "Saves all messages in a server",
    args: "No arguments",
    isAdmin: true,
    hidden: true,
	execute(message, serverListJSON, fs) {

        let filePath = "../assets/servers/";

        // For each server in the server list
        for(const serverJSON of serverListJSON)
        {
            // Generate a server filename
            let fileName = filePath + serverJSON.id + ".json";

            // Convert the server JSON object to text
            let serverTEXT = JSON.stringify(serverJSON);

            // Write the file
            fs.writeFileSync(fileName, serverTEXT, "utf8");
        }
        
        message.channel.send("Save Complete!");
	},
};