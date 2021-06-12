const tl = new TimelineMax();

const alertEvents = {
	"subscription": async ([username]) => {
		let maintext = `Thank you for the sub ❤️`;
		let subtext = `${username}`;
		alertBoxHandler(maintext, subtext);
	},
	"resub": async ([username, months]) => {
		let maintext = `Thank you for the resub ❤️`;
		let subtext = `${username} - ${months} months`;
		alertBoxHandler(maintext, subtext);
	},
	"donation": async ([username, amount]) => {
		let maintext = `Thank you for the donation ❤️`;
		let subtext = `${username} - ${amount}`;
		alertBoxHandler(maintext, subtext);
	},
	"host": async ([username]) => {
		let maintext = `Thank you for hosting ❤️`;
		let subtext = `${username}`;
		alertBoxHandler(maintext, subtext);
	},
	"raid": async ([username, viewers]) => {
		let maintext = `${username} is raiding us`;
		let subtext = `with ${viewers} viewers!`;
		alertBoxHandler(maintext, subtext);
	},
	"follow": async ([username]) => {
		let maintext = `Thank you for the follow ❤️`;
		let subtext = `${username}`;
		follower.innerText = `Latest Follower: ${username}`;
		alertBoxHandler(maintext, subtext);
	},
	"cheer": async ([username, amount]) => {
		let maintext = `Thank you for the bits ❤️`
		let subtext = `${username} - ${amount} Bits`
		alertBoxHandler(maintext, subtext);
	}
};

async function parseAlertParams(args) {
	const command = args.shift();

	if (Object.keys(alertEvents).includes(command)) {
		alertEvents[command](args);
	}
}

async function alertBoxHandler(maintext, subtext) {
	if (tl.isActive() === false) {
		alertBox(maintext, subtext)
	} else {
		localData.alertQueue.push({ maintext: maintext, subtext: subtext });
	}
}

async function alertBox(maintext, subtext) {
	let mainText = document.getElementsByClassName('maintext')[0];
	let subText = document.getElementsByClassName('subtext')[0];
	let animContainer = document.getElementsByClassName(
		'alertAnimContainer'
	)[0];

	let anim = document.getElementsByClassName('anim')[0];

	mainText.innerText = maintext;
	subText.innerText = subtext;

	console.log(maintext, subtext, localData.alertQueue)

	new Audio('bell.wav').play();

	// let tl = new TimelineMax();
	await tl.to(animContainer, 0.4, { opacity: 1 })
		.to(anim, 0.4, { rotation: -20 })
		.to(anim, 0.4, { rotation: 0 }, '+=0.2')
		.to(anim, 0.5, { scale: 1.4 })
		.to(animContainer, 0.6, { opacity: 0 }, '-=0.1')
		.to(anim, 0.1, { scale: 1 });

	if (localData.alertQueue.length > 0) {
		const newAlert = localData.alertQueue.shift();
		alertBox(newAlert.maintext, newAlert.subtext)
	}
}