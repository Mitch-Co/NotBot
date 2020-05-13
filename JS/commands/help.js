module.exports = {
	name: 'help',
    description: 'Lists all current commands',
    isAdmin: false,
    hidden: false,
	execute(message, client) {
        let commnandList = "BootyBot 5000 Command List:\n";
        let commandmap = client.commands.array();
        for (command of commandmap)
        {
            if(!command.hidden)
            {
                commnandList = commnandList + "> " + command.name + " : " + command.description.toString() + "\n";
            }
        }

        message.channel.send(commnandList);
	},
};