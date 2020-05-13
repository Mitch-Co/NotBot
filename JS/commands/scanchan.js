module.exports = {
	name: 'scanchan',
    description: 'Scans all messages in the current channel, mainly a test command',
    isAdmin: true,
    hidden: false,
	async execute(channel) {

        let manager = channel.messages;
        let absLimit = 100000;
        let toReturn = [];

        let rounds = absLimit/100;
        let lastID = "";

        for (let i = 0; i < rounds; i++) {
            
            let breakflag = false;
            let options;

            if(lastID.length > 0) {
                options = {
                    limit:100,
                    before:lastID,
                }
            }
            else
            {
                options = {
                    limit:100,
                }
            }
            await manager.fetch(options)
            .then(messages => {
                let msgArray = messages.array();
                if(msgArray.length < 100 || msgArray == null)
                {
                    breakflag = true;
                }
                else
                {
                    for (const message of messages)
                    {
                        toReturn.push(message);
                    }
                    if(lastID == msgArray[msgArray.length - 1].id.toString())
                    {
                        breakflag = true;
                    }
                    lastID = msgArray[msgArray.length - 1].id.toString();
                }

            })
            .catch((err) => {
                breakflag = true;
            });

            if(breakflag === true)
            {
                break;
            }

        }
        console.log("DONE SCANNING " + channel.toString());
        return toReturn;

	},
};