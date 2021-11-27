const { err, info } = require("../logger");
const User = require("../models/User");
const CustomCommand = require("../models/CustomCommand");

module.exports.run = async (client, wss, message, args, {channel, tags}) => {
	User.findOne({ twitchId: tags["user-id"] })
		.then(async (document) => {
			if (document == null) {
				User.create({ twitchId: tags["user-id"], displayName: tags["display-name"] });
				client.say(channel, `@${tags.username}, You dont have permissions to use this command. Required Permissions: customCommandManagement`);
			} else if (document.permissions.customCommandManagement) {
        if (args.length > 1) {
          let commandName = args[0];
          let commandResponse = args.slice(1, args.length).join(" ");
          CustomCommand.findOne({ command: commandName })
            .then( async (document) => {
              if (document == null) {
                CustomCommand.create({ command: commandName, response: commandResponse });
              } else {
                document.response = commandResponse;
                document.save();
              }
            })
            .catch((error) => err("Command: createCommand", error))
        } else {
          client.say(channel, `@${tags.username}, Dont forget to specify all the parameters! !createCommand <command> <response>`);
        }
      } else {
        client.say(channel, `@${tags.username}, You dont have permissions to use this command. Required Permissions: customCommandManagement`);
      }
		})
		.catch((error) => err("Command: createCommand", error));
};

module.exports.config = {
  name: "createCommand",
  aliases: ["updateCommand", "addcmd", "addcommand"]
}