const { err } = require("../logger");
const User = require("../models/User");

module.exports.run = async (client, wss, message, args, { channel, tags }) => {
	User.findOne({ twitchId: tags["user-id"] })
		.then(async (document) => {
			if (document == null) {
				User.create({ twitchId: tags["user-id"], displayName: tags["display-name"] });
				client.say(channel, `@${tags.username}, You have 0 points.`);
			} else {
				client.say(channel, `@${tags.username}, You have ${document.points} points.`);
			}
		})
		.catch((error) => err("Command: points", error));
};

module.exports.config = {
  name: 'points',
  aliases: ['point']
};