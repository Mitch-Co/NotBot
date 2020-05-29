module.exports = {
	name: "popword",
    description: "Finds the word you have used most often",
    args: "No arguments",
    isAdmin: true,
    hidden: true,
	async execute(message, serverJSON) {

        if(serverJSON == null)
        {
            message.channel.send("SERVER FILE NOT RECEIVED!");
            return;
        }

        let wordList = [];
        let requesterID = message.author.id;

        for(channel of serverJSON.channels)
        {
            for(chanMessage of channel.messages)
            {
                if(chanMessage.author == requesterID)
                {
                    let splitString = chanMessage.text.split(/ +|\n/);

                    for(word of splitString)
                    {
                        let processedWord = word;
                        if(processedWord == "")
                        {
                            continue;
                        }
                        let foundWord = grabWord(wordList, processedWord);
                        
                        if(foundWord === null)
                        {
                            //console.log("adding new word " + processedWord);
                            let toAdd = newWord(processedWord);
                            toAdd.count += 1;
                            wordList.push(toAdd);
                        }
                        else
                        {
                            //console.log("incrementing " + foundWord.name);
                            foundWord.count += 1;
                        }
                    }
                }
            }
        }

        let wordsToDisplay = 20;

        let toReturn = "What are your " + wordsToDisplay + " most popular words "+ message.author.toString() +"?" + "\n";

        if(wordList.length < wordsToDisplay)
        {
            message.channel.send("You have said less than " + wordsToDisplay.toString() + " words, please say more things.");
        }

        wordList.sort(function(a, b){
            return b.count - a.count;
        });
        
        for(let i = 0; i < wordsToDisplay; i++)
        {
            toReturn += wordList[i].name + ":" + wordList[i].count.toString() + " times" + "\n";
        }

        if(toReturn.length > 2000)
        {
            message.channel.send("Wow your "+ wordsToDisplay.toString() +" longest words have a combined total of over 2000 characters!");
            return;
        }
        message.channel.send(toReturn);
    },
};

function newWord(wordIn)
{
    let wordObj = {};
    wordObj.count = 0;
    wordObj.name = wordIn.toString();
    return wordObj;
}

function grabWord(wordList, wordToFind) {

    for(wordObj of wordList)
    {
        if (wordObj.name == wordToFind)
        {
            return wordObj;
        }
    }
    return null;
}