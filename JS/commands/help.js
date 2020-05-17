module.exports = {
	name: "help",
    description: "Lists all current commands; Use the help command with an argument to select help for a specific command",
    args: "help <command name (optional)>",
    isAdmin: false,
    hidden: false,
	execute(message, args, client) {

        let commandmap = client.commands.array();
        let response;

        if(args.length === 1)
        {
            let command = client.commands.get(args[0]);
            if(command == null)
            {
                message.channel.send(args[0] + " is not a valid command. Use the help command with no arguments to list all commands.");
                return;
            }
            let response = command.name + ":\n";
            response += "`Description:` " + command.description + "\n";
            response += "`Usage:` " + command.args + "\n";
            response += "`Admin only:` " + command.isAdmin.toString() + "\n";
            message.channel.send(response);
            return;
        }
        else
        {
            response = "BootyBot 5000 Command List:\n";
            for (command of commandmap)
            {
                if(!command.hidden)
                {
                    response += "> " + command.name + " : " + command.description + "\n";
                }
            }
    
            message.channel.send(response);
        }


	},
};