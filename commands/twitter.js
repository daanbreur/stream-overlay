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
          `@${tags.username}, my twitter is https://twitter.com/PortaalG`
        );
      } else {
        client.say(
          channel,
          `@${tags.username}, my twitter is https://twitter.com/PortaalG`
        );
      }
    })
    .catch((error) => err('Command: twitter', error));
};

module.exports.config = {
  name: 'twitter',
  aliases: ['tw'],
};
