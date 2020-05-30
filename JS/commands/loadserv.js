module.exports = {
	name: 'loadserv',
    description: 'Loads all messages from server files',
    args: "No arguments",
    isAdmin: true,
    hidden: true,
	execute(fs) {

        let filePath = "../assets/servers/";
        let toReturnJSON = [];

        // Locate all json files in the filePath folder
        const serverFiles = fs.readdirSync(filePath).filter(file => file.endsWith(".json"));

        // Load all servers into the toReturnJSON
        for(const file of serverFiles)
        {
            let jsonText = fs.readFileSync(filePath + file, "utf8");
            toReturnJSON.push(JSON.parse(jsonText));
        }

        return toReturnJSON;
	},
};