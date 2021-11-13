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
          `@${tags.username}, welcome back to the stream! We hope your lurk was good!`
        );
      } else {
        client.say(
          channel,
          `@${tags.username}, welcome back to the stream! We hope your lurk was good!`
        );
      }
    })
    .catch((error) => err('Command: unlurk', error));
};

module.exports.config = {
  name: 'unlurk',
  aliases: [],
};
