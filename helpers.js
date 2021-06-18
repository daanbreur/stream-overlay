const fetch = require('node-fetch');
const { log, warn, err, info } = require('./logger');
require('dotenv').config();

let getAccessTokenURI = `https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials&scope=analytics%3Aread%3Aextensions%20analytics%3Aread%3Agames%20bits%3Aread%20channel%3Aedit%3Acommercial%20channel%3Aread%3Ahype_train%20channel%3Aread%3Astream_key%20channel%3Aread%3Asubscriptions%20clips%3Aedit%20moderation%3Aread%20user%3Aedit%20user%3Aedit%3Abroadcast%20user%3Aedit%3Afollows%20user%3Aread%3Abroadcast%20user%3Aread%3Aemail`;

module.exports.bearerToken = async function () {
	return new Promise((resolve, reject) => {
		fetch(getAccessTokenURI, {
			method: 'POST',
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.access_token) {
					info(`Token`, `Used Token Recieved from API.`);
					resolve(json.access_token);
				}
				if (!json.access_token) {
					info(`Token`, `Used Token From dotenv file.`);
					resolve(process.env.CLIENT_BEARER);
				} 
				else reject();
			});
	});
};

module.exports.getLatestFollower = async function (token) {
	return new Promise((resolve, reject) => {
		fetch(`https://api.twitch.tv/helix/users/follows?to_id=244294836`, {
			headers: {
				'Client-ID': process.env.CLIENT_ID,
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.data) resolve(json.data[0].from_name);
				else resolve('');
			});
	});
};

module.exports.checkColor = function (color) {
	return new Promise((resolve, reject) => {
		let re = new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$');
		let colors = {
			red: '#FF0000',
			green: '#00FF00',
			blue: '#0000FF',
			gray: '#808080',
			grey: '#808080',
			cyan: '#00FFFF',
			magenta: '#FF00FF',
			yellow: '#FFFF00',
			brown: '#996633',
			orange: '#FF8000',
			pink: '#FF8080',
			purple: '#800080',
		};

		color = color.toLowerCase();
		if (colors[color]) resolve(colors[color]);
		if (re.test(color)) resolve(color);
		else reject(color);
	});
};

module.exports.newUserEntry = function() {}