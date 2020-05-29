module.exports = {
	name: "saveserv",
    description: "Saves all messages in a server",
    args: "No arguments",
    isAdmin: true,
    hidden: true,
	execute(message, serverListJSON, fs) {
        let filePath = "../assets/servers/";
        for(const serverJSON of serverListJSON)
        {
            let fileName = filePath + serverJSON.id + ".json";
            let serverTEXT = JSON.stringify(serverJSON);
            fs.writeFileSync(fileName, serverTEXT, "utf8");
        }
        message.channel.send("Save Complete!");
	},
};