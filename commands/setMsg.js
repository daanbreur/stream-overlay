const { info } = require('../logger');

module.exports.run = async (client, wss, message, args, {channel, tags}) => {
		if (!(tags["user-type"] === "mod" || tags.username === channel.replace("#", ""))) {
			client.say(channel, `@${tags.username}, you have to be a moderator to use this command`);
			return;
		}

    let messageObject = {
      text: args.slice(1,args.length).join(" "),
      transparent: (args[0] === 'true'),
    }

    wss.clients.forEach((ws) => {
			ws.send(`startMsg ${messageObject.transparent} ${messageObject.text}`);
		});
    
    client.say(channel, `@${tags.username}, Enabled message with text ${messageObject.text} and ${messageObject.transparent ? 'WITH' : 'WITHOUT'} a transparent background`);
};

module.exports.config = {
  name: 'sendMsg',
  aliases: ['setMsg', 'setMessage']
};