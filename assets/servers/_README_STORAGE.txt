WHAT IS THIS AREA FOR?
--------------------------------------------------------------------------------------
This area is for storing server text logs.
It should be empty, save for this text file, until you scan and save a server.
All server message logs will be saved into .json files upon scanning and saving.


HOW DOES IT WORK?
--------------------------------------------------------------------------------------
NOTE: NOTBOT DOES NOT AUTOMATICALLY SAVE SERVERS AFTER SCANNING
NOTEx2: NOTBOT DOES LOAD SERVERS AUTOMATICALLY 
After NotBot scans a server, you can use the copy of the server in memory until notbot is restarted.
If you decide to save the servers, this is the area where they will be stored.

Servers are stored as JSON objects.
When saving is initiated, all server JSON objects get JSON.stringify()-d and written to their own json file.
Each server has its own JSON object, the format of which is discribed below.


FILE FORMAT:
--------------------------------------------------------------------------------------
Each server JSON file will have the name of the server as the file name.
		
Each server JSON object will contain the following:
	id: <server id>
	date: <date when file was saved> (FORMAT TO BE DETERMINED)
	channels: A list of all text channels in the server

Each channel object in "channels" contains:
	id: <channel id>
	messages: A list of all messages that have been said in the server

Each message object in "messages" contains:
	text: <text associated with the post> (UTF-8)
	author: <id of user who posted message>
	date: <date of when message was posted> (FORMAT TO BE DETERMINED)
	reactions: A list of reactions on the post

Each reaction object in "reactions" contains:
	name: <A UTF-8 character representing the emoji/reaction> OR <a reaction ID for custom reactions>
	authors: A list of users who reacted with this emoji/reaction

Each author in "authors" contains:
	id: <id of user who reacted with reaction> 



