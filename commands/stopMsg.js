const { info } = require('../logger');

module.exports.run = async (client, wss, message, args, {channel, tags}) => {
		if (!(tags["user-type"] === "mod" || tags.username === channel.replace("#", ""))) {
			client.say(channel, `@${tags.username}, you have to be a moderator to use this command`);
			return;
		}

    wss.clients.forEach((ws) => {
			ws.send(`endMsg`);
		});
    
    client.say(channel, `@${tags.username}, Disabled message on overlay.`);
};

module.exports.config = {
  name: 'endMsg',
  aliases: ['stopMsg', 'stopMessage', 'endMessage']
};