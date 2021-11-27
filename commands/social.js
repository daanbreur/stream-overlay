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
          `@${tags.username}, You can follow me on https://twitter.com/PortaalG and https://github.com/daanbreur`
        );
      } else {
        client.say(
          channel,
          `@${tags.username}, You can follow me on https://twitter.com/PortaalG and https://github.com/daanbreur`
        );
      }
    })
    .catch((error) => err('Command: social', error));
};

module.exports.config = {
  name: 'social',
  aliases: ["socials", "followme"],
};
