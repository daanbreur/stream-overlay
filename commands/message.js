const { err, info } = require("../logger");
const User = require("../models/User");

module.exports.run = async (client, wss, message, args, {channel, tags}) => {
	User.findOne({ twitchId: tags["user-id"] })
		.then(async (document) => {
			if (document == null) {
				User.create({ twitchId: tags["user-id"], displayName: tags["display-name"] });
				client.say(channel, `@${tags.username}, You dont have permissions to use this command. Required Permissions: overlayMessage`);
			} else if (document.permissions.overlayMessage) {
        if (args[0] == "enable" && args.length >= 3) {
          let messageText = args.slice(2,args.length).join(" ");
          if (args[1] == "true" || args[1] == "false") { 
            wss.clients.forEach(async (ws) => {
              ws.send(`message start ${args[1]} ${messageText}`)
            });
            global.globalData.message.enabled = true;
            global.globalData.message.transparent = args[1];
            global.globalData.message.message = messageText;
          } else {
            client.say(channel, `@${tags.username}, Incorrect Parameters !message enable true/false <message> or !message disable`);            
          }
        } else if (args[0] == "disable") {
          wss.clients.forEach(async (ws) => {
            ws.send(`message end`);
            global.globalData.message.enabled = false;
            global.globalData.message.transparent = "true";
            global.globalData.message.message = "";
          });
        } else {
          client.say(channel, `@${tags.username}, Dont forget to specify all the parameters! !message enable true/false <message> or !message disable`);
        }

      } else {
        client.say(channel, `@${tags.username}, You dont have permissions to use this command. Required Permissions: overlayMessage`);
      }
		})
		.catch((err) => err("Command: message", err));
};

module.exports.config = {
  name: "message",
  aliases: ["msg"]
}