const { err } = require("../logger");
const User = require("../models/User");

module.exports.run = async (client, wss, message, args, { channel, tags }) => {
	if (args[0] === "red" || args[0] === "blue") {
		User.findOne({ twitchId: tags["user-id"] })
			.then(async (document) => {
				if (document == null) {
					User.create({ twitchId: tags["user-id"], displayName: tags["display-name"], team: args[0] }).catch((err) => err("Command: Team", err));;
				} else {
					document.team = args[0];
					document.save();
				}
				client.say(channel, `@${tags.username}, You have successfully joined team ${args[0]}`);
			})
			.catch((err) => err("Command: team", err));
	} else {
		client.say(channel, `@${tags.username}, To join a team. Type !team red or !team blue`);
		let userInDatabase = await User.exists({ twitchId: tags["user-id"] });
		if (!userInDatabase) {
			User.create({ twitchId: tags["user-id"], displayName: tags["display-name"] }).catch((err) => err("Command: team", err));;
		}
	}
};

module.exports.config = {
  name: 'team',
  aliases: []
};