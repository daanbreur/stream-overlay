require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const { getLatestFollower, checkColor, bearerToken } = require('./helpers');
const { log, warn, err, info } = require('./logger');

const requireAll = require('require-all'); 
const TMI = require('tmi.js');

const express = require('express');
const app = express();
const cors = require('cors');

const WebSocketServer = require('ws').Server, wss = new WebSocketServer({ port: 40510 });
const io = require('socket.io-client'), StreamelementsClient = io(`https://realtime.streamelements.com`, {transports: ['websocket']});

const client = new TMI.client({
	connection: {
		secure: true,
		reconnect: true,
	},
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.OAUTH_TOKEN,
	},
	channels: ['portaalgaming'],
});

client.commands = new Map();
client.aliases = new Map();
client.database = mongoose.connection;
client.connect();

global.globalData = {
	bannerColor: '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0'),
	ltsFollower: '',
};


(async () => {
	const commandFiles = requireAll({
		dirname: `${__dirname}/commands`,
		filter: /^(?!-)(.+)\.js$/,
	});

	for (const name in commandFiles) {
		const cmd = commandFiles[name];

		client.commands.set(cmd.config.name, cmd);
		for (const a of cmd.config.aliases) client.aliases.set(a, cmd.config.name);

		console.log(`Command loaded: ${cmd.config.name}`);
	}
})();

setInterval(() => {
	wss.clients.forEach((ws) => {
		if (!ws.isAlive) return ws.terminate();

		ws.isAlive = false;
		ws.ping(null);
	});
}, 10000);

app.use(cors())
app.use(express.static('public'));
app.use(express.json());
app.get('/', (req, res) => { res.sendFile(`${__dirname}/public/index.html`) });

app.listen(process.env.PORT, async () => {
	info(`Webserver`, `Running on http://localhost:${process.env.PORT}`);
	info(`Webserver`, `Generated color: ${globalData.bannerColor}`);

	let bearerAccessToken = await bearerToken();
	globalData.ltsFollower = await getLatestFollower(bearerAccessToken);
});



client.on('message', async (channel, tags, message, self) => {
	if (self) return;

	const prefix = '!';
	const [cmd, ...args] = message.trim().slice(prefix.length).split(/\s+/g);

	const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
	if (command) {
		command.run(client, wss, message, args, { channel, tags } );
		console.log(`Executing ${command.config.name} command for ${tags.username}.`);
	}
});

wss.on('connection', async (ws) => {
	ws.isAlive = true;
	ws.send(`color ${globalData.bannerColor}`);
	ws.send(`setfollower ${globalData.ltsFollower}`);

	ws.on('pong', () => { ws.isAlive = true });
	ws.on('message', async (message) => { info(`Websocket Server`, `Recieved: ${message}`) });
});


StreamelementsClient.on('connect', () => {
	info(`StreamelementsClient`, `Successfully connected to Server!`);
	StreamelementsClient.emit('authenticate', {
		method: 'jwt',
		token: process.env.STREAMELEMENTS_JWT
	})
});
StreamelementsClient.on('disconnect', () => info(`StreamelementsClient`, `Disconnected from Server!`));
StreamelementsClient.on('authenticated', (data) => info(`StreamelementsClient`, `Successfully authenticated to Server! Channel: ${data.channelId}`));

StreamelementsClient.on('event', (data) => {
	console.log(data);

	if (data.provider.toLowerCase() == 'twitch') {
		switch (data.type.toLowerCase()) {
			case 'follow':
				wss.clients.forEach( (ws) => {
					ws.send(`setfollower ${data.data.displayName}`);
					ws.send(`alert follow ${data.data.displayName}`);
				});
				break;
			case 'raid':
				wss.clients.forEach( (ws) => {
					ws.send(`alert raid ${data.data.displayName} ${data.data.amount}`);
				});
				break;
			case 'host':
				wss.clients.forEach( (ws) => {
					ws.send(`alert host ${data.data.displayName}`);
				});
				break;
			case 'tip':
				let formattedAmount = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: data.data.currency }).format(data.data.amount);
				wss.clients.forEach( (ws) => {
					ws.send(`alert donation ${data.data.username} ${formattedAmount}`);
				});	
				break;
			case 'subscriber':
				wss.clients.forEach( (ws) => {
					ws.send(`alert subscription ${data.data.displayName}`);
				});
				break;
			case 'cheer':
				wss.clients.forEach( (ws) => {
					ws.send(`alert cheer ${data.data.displayName} ${data.data.amount}`);
				});
				break;
		}
	}
});

// StreamelementsClient.on('event', async (eventData) => {
// 	log(`StreamelementsClient`, eventData);
// 	let data = eventData.message[0]
// 	if (eventData.for === 'twitch_account') {
// 		switch(eventData.type) {
// 			case 'follow':
// 				wss.clients.forEach((ws) => {
// 					ws.send(`setfollower ${data.name}`);
// 					ws.send(`alert follow ${data.name}`);
// 				});
// 				break;
// 			case 'subscription':
// 				wss.clients.forEach((ws) => { ws.send(`alert subscription ${data.name}`) });
// 				break;
// 			case 'resub':
// 				wss.clients.forEach((ws) => { ws.send(`alert resub ${data.name} ${~~data.months}`) });
// 				break;
// 			case 'host':
// 				wss.clients.forEach((ws) => { ws.send(`alert host ${data.name}`) });
// 				break;
// 			case 'raid':
// 				wss.clients.forEach((ws) => { ws.send(`alert raid ${data.name} ${data.raiders}`) });
// 				break;
// 		}
// 	} else if (eventData.for === 'streamlabs') {
// 		switch(eventData.type) {
// 			case 'donation':
// 				wss.clients.forEach((ws) => { ws.send(`alert donation ${data.name} ${data.formatted_amount}`) });
// 				break;
// 		}
// 	}
// })

// {
//   _id: '60b8bab383809a64938e7922',
//   channel: '5f00ac843cd73291a4170b58',
//   type: 'follow',
//   provider: 'twitch',
//   flagged: false,
//   data: {
//     username: 'mr_no_man123',
//     providerId: '582882096',
//     displayName: 'mr_no_man123',
//     quantity: 0,
//     avatar: 'https://cdn.streamelements.com/static/default-avatar.png'
//   },
//   createdAt: '2021-06-03T11:19:15.285Z',
//   updatedAt: '2021-06-03T11:19:15.285Z'
// }