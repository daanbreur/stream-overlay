const { err, info } = require("../logger");
const CustomCommand = require("../models/CustomCommand");

module.exports.run = async (client, wss, message, args, {channel, tags}) => {
  if (args.length > 0) {
    let commandName = args[0];
    CustomCommand.findOne({ command: commandName })
      .then( async (document) => {
        if (document == null) {
          client.say(channel, `@${tags.username}, Could not find the command you searched for.`);      
        } else {
          console.log(document.command, document.response, );
          let permissionString = "";
          document.permissions.forEach( permission => permissionString += `${permission} `);
          client.say(channel, `@${tags.username}, One of the following permissions is needed to run this that command: ${permissionString} (if empty none are needed)`)
        }
      })
      .catch((error) => err("Command: createCommand", error))
  } else {
    client.say(channel, `@${tags.username}, Dont forget to specify all the parameters! !listPermissions <command>`);
  }
};

module.exports.config = {
  name: "listPermissions",
  aliases: ["checkPermissions", "checkperms"]
}