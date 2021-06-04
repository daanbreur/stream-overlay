const { checkColor } = require('../helpers');
const { info } = require('../logger');

module.exports.run = async (client, wss, message, args, { channel, tags }) => {
		let code = await checkColor(args[0]);
		global.globalData.bannerColor = code;
		wss.clients.forEach((ws) => {
			ws.send(`color ${code}`);
		});
		info(
			`Overlay Backend`,
			`Successfully Set Color to ${code} | Issued by: ${tags.username}`
		);
};

module.exports.config = {
	name: 'color',
	aliases: ['c', 'clr'],
};
