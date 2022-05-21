const { err } = require('../logger');
const User = require('../models/User');

module.exports.run = async (client, wss, message, args, { channel, tags }) => {
  User.findOne({ twitchId: tags['user-id'] })
    .then(async (document) => {
      if (document == null) {
        User.create({
          twitchId: tags['user-id'],
          displayName: tags['display-name'],
        });
        client.say(
          channel,
          `@${tags.username}, my discord server is at https://discord.gg/MCUpHNnSw5`
        );
      } else {
        client.say(
          channel,
          `@${tags.username}, my discord server is at https://discord.gg/MCUpHNnSw5`
        );
      }
    })
    .catch((error) => err('Command: blog', error));
};

module.exports.config = {
  name: 'discord',
  aliases: ['discord-server'],
};
