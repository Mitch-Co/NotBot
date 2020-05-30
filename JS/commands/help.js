module.exports = {
	name: "help",
    description: "Lists all current commands; Use the help command with an argument to select help for a specific command",
    args: "help <command name (optional)>",
    isAdmin: false,
    hidden: false,
	execute(message, args, client) {

        // Array representation of all commands
        let commandmap = client.commands.array();

        // Stringbuilder used for output discord message
        let response;
        
        // If the user enters an argument
        if(args.length === 1)
        {
            // Return info on the specific command the user requests

            // Grab the command the user wants 
            let command = client.commands.get(args[0]);
            if(command == null)
            {
                message.channel.send(args[0] + " is not a valid command. Use the help command with no arguments to list all commands.");
                return;
            }

            // Grab command properties
            let response = command.name + ":\n";
            response += "`Description:` " + command.description + "\n";
            response += "`Usage:` " + command.args + "\n";
            response += "`Admin only:` " + command.isAdmin.toString() + "\n";

            message.channel.send(response);
        }
        else
        {
            // Return a list of all non hidden commands

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