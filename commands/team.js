const { err } = require( '../logger' )

module.exports.run = async (client, wss, message, args, {channel, tags}) => {
	try {
		let doc = await find(tags['user-id']);

		if (!(args[0] === 'x' || args[0] === 'o')) {
			client.say(channel, `@${tags.username}, to join a team type !team x|o`);
			return;
		}

		if (doc == null) {
			insert(tags['user-id'], { points: 0, team: args[0] });
		} else {
			update(tags['user-id'], 'team', args[0]);
    }
    
    client.say(channel, `@${tags.username}, you joined team ${args[0]}`);
	} catch (error) {
		err('Command: team-select', error)
	}
};

module.exports.config = {
  name: 'team',
  aliases: []
};