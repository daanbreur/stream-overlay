const { err } = require( '../logger' );
const { newUserEntry } = require( '../helpers' );

module.exports.run = async (client, wss, message, args, {channel, tags}) => {
	try {
		let doc = client.database.users[tags['user-id']];

		if (doc == null) {
			client.say(channel, `@${tags.username}, You have 0 points.`);
			insert(tags['user-id'], { points: 0 });
			
			return;
		}

		client.say(channel, `@${tags.username}, You have ${doc.points} points.`);
	} catch (error) {
		err('Command: points', error)
	}
};

module.exports.config = {
  name: 'points',
  aliases: ['point']
};