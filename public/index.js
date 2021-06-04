const ws = new WebSocket( 'ws://localhost:40510' );

ws.onopen = () => {
    console.log('[WebSocket] Connected...')
    ws.send('connected')
};

let localData = {
    follower: '',
    alertQueue: [],
};

const events = {
    "alert": async (args) => { parseAlertParams(args); },
    "color": async (color) => { banner.style.backgroundColor = color; },
    "setfollower": async (username) => { follower.innerText = `Latest Follower: ${username}`; },
    "updateSong": async (title, artist, imgUrl) => {
        
    },
    "startMsg": async ([transparent, ...message]) => {
        transparent = (transparent === 'true')
        message = message.join(' ')
        if (transparent) { document.getElementsByTagName('body')[0].style['background-color'] = 'rgba(0,0,0,0)' }
        else { document.getElementsByTagName('body')[0].style['background-color'] = 'black' }
        MessageText.style.opacity = 1;
        MessageText.innerText = message.toString();
        MessageText.setAttribute('data-text', message.toString())
    },
    "endMsg": async () => {
        document.getElementsByTagName('body')[0].style['background-color'] = 'rgba(0,0,0,0)';
        MessageText.style.opacity = 0;
    }
}

ws.onmessage = (ev) => {
    const args = ev.data.split(' ');
    const command = args.shift();

    if (Object.keys(events).includes(command)) {
        events[command](args);
    }
};

(async () => {
    MessageText.style.opacity = 0;
})()