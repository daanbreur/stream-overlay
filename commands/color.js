const { checkColor } = require('../helpers');
const { info, warn } = require('../logger');

module.exports.run = async (client, wss, message, args, { channel, tags }) => {
		if (typeof args[0] != "string" || !(args[0].length >= 1)) return client.say(channel, `@${tags.username}, Incorrect Parameters !color <hexcode> or !color <colorname>`)
		checkColor(args[0])
		.then((code) => {
			global.globalData.bannerColor = code;
			wss.clients.forEach((ws) => {
				ws.send(`color ${code}`);
			});
			info(
				`Overlay Backend`,
				`Successfully Set Color to ${code} | Issued by: ${tags.username}`
			);
		})
		.catch((code) => {
			client.say(channel, `@${tags.username}, Incorrect Hexcode or Colorname specified. Please use a valid one.`)
			warn(
				`Overlay Backend`,
				`Incorrect hexcode or colorname specified: ${code} | Issued by: ${tags.username}`
			);
		});
};

module.exports.config = {
	name: 'color',
	aliases: ['c', 'clr'],
};
