module.exports = {
	name: 'saveserv',
    description: 'Saves all messages in a server',
    isAdmin: true,
    hidden: false,
	execute(serverListJSON, fs) {
        let filePath = "../assets/servers/";
        for(const serverJSON of serverListJSON)
        {
            let fileName = filePath + serverJSON.id + ".json";
            let serverTEXT = JSON.stringify(serverJSON);
            fs.writeFileSync(fileName, serverTEXT, "utf8");
        }
	},
};