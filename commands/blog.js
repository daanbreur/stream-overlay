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
          `@${tags.username}, my blog / website is at https://blog.daanbreur.systems/`
        );
      } else {
        client.say(
          channel,
          `@${tags.username}, my blog / website is at https://blog.daanbreur.systems/`
        );
      }
    })
    .catch((error) => err('Command: blog', error));
};

module.exports.config = {
  name: 'blog',
  aliases: ['site', 'website'],
};
