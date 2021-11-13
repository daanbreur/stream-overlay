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
          `@${tags.username}, have a good lurk. You will be missed.`
        );
      } else {
        client.say(
          channel,
          `@${tags.username}, have a good lurk. You will be missed.`
        );
      }
    })
    .catch((error) => err('Command: lurk', error));
};

module.exports.config = {
  name: 'lurk',
  aliases: [],
};
