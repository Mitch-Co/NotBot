module.exports = {
	name: "popword",
    description: "Finds the word you have used most often",
    args: "No arguments",
    isAdmin: true,
    hidden: true,
	async execute(message, serverJSON) {

        // NOTE: THE RUNTIME OF THIS FUNCTION IS REALLY REALLY REAAAAALLY BAD
        // AS SUCH, IT IS HIDDEN AND ADMIN-ONLY
        // IT COULD BE FIXED WITH A HASHMAP, BUT THIS FUNCTION IS TOO BORING FOR ME TO CARE ABOUT IT MUCH

        if(serverJSON == null)
        {
            message.channel.send("SERVER FILE NOT RECEIVED!");
            return;
        }

        // wordList stores all instances of unique words said by the requester/user
        let wordList = [];
        let requesterID = message.author.id;

        // Scans all channels and all messages in those channels
        for(channel of serverJSON.channels)
        {
            for(chanMessage of channel.messages)
            {
                // Only scan messages said by the author
                if(chanMessage.author == requesterID)
                {
                    // Break the message up by separating by either spaces or newlines
                    let splitString = chanMessage.text.split(/ +|\n/);

                    for(word of splitString)
                    {
                        // Remove anything at the start or end of the word (punctuation, etc)
                        let processedWord = word.match(/\w+/);
                        if(processedWord === "" || processedWord == null)
                        {
                            continue;
                        }

                        // Lowercase and finilize string
                        let finalWord = processedWord[0].toLowerCase();
                        
                        // Grab the word we finilized from the wordList
                        let foundWord = grabWord(wordList, finalWord);
                        
                        // If it is not in the wordList, put it in the wordList
                        if(foundWord === null)
                        {
                            let toAdd = newWord(finalWord);
                            toAdd.count += 1;
                            wordList.push(toAdd);
                        }
                        else
                        {
                            // Increment the found word's count by 1
                            foundWord.count += 1;
                        }
                    }
                }
            }
        }

        // A const that tells the code how many popular words to display
        let wordsToDisplay = 10;

        // toReturn is the string that gets displayed by the bot
        let toReturn = "What are your " + wordsToDisplay + " most popular words "+ message.author.toString() +"?" + "\n";

        // If the user has not said wordsToDisplay words, return
        if(wordList.length < wordsToDisplay)
        {
            message.channel.send("You have said less than " + wordsToDisplay.toString() + " words, please say more things.");
            return;
        }

        // Sort the wordList based on its count variables, from highest to lowest
        wordList.sort(function(a, b){
            return b.count - a.count;
        });
        
        // Take the first 0 to wordsToDisplay elements of wordList and print them to toReturn
        for(let i = 0; i < wordsToDisplay; i++)
        {
            toReturn += wordList[i].name + ":" + wordList[i].count.toString() + " times" + "\n";
        }

        // Incase the return text is too long to be displayed in discord
        if(toReturn.length > 2000)
        {
            message.channel.send("Wow your "+ wordsToDisplay.toString() +" longest words have a combined total of over 2000 characters!");
            return;
        }

        
        message.channel.send(toReturn);
    },
};

// Generates and returns a new word object
function newWord(wordIn)
{
    let wordObj = {};

    wordObj.count = 0;
    wordObj.name = wordIn.toString();

    return wordObj;
}

// This function grabs a word object from the word list
// It does so linearly
// Realistically I should be using a hashmap to store and access data in this way
// But I dont care enough about this function to make a hashmap for it specifically
// Also making a hashmap in javascript would be annoying and take too long for me to care
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