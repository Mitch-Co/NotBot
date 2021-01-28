# NotBot

## What is NotBot?

NotBot is a discord bot written in [discord.js](https://discord.js.org). It can analyze server messages and provide statistics on various server metrics.<br/>

A major rewrite of NotBot had to be done after discovering that JSON object saving and reading works just slightly differently than expected. Some code could have allowed for a hacky fix, but a rewrite seemed more appropriate. 

## Getting Started
To run NotBot - Install Node JS, install the discord js node module in the `JS` folder.
After installation, replace the `exampleconfig.json` in the `assets` folder with your custom config.json file.

## Functionality

Some starter commands are as follows:

`scanserv` - Scans the server you are currently in
`saveserv` - Saves all scanned servers to JSON files

After scanning and saving a server, commands can be found by using the `help` command.
Some interesting commands include:

`reactionr <discord emoji>` - Shows how many times people have received a reaction<br/>
`reaction <discord emoji>` - Shows how many times people have given a reaction<br/>
`stru <sentence>` - Finds the number of times people on the server have said the sentence<br/>