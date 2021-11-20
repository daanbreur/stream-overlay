const ws = new WebSocket( 'ws://localhost:40510' );

ws.onopen = () => {
    console.log('[WebSocket] Connected...')
    ws.send('connected')
};

let localData = {
    alertQueue: []
};

const events = {
    "alert": async (args) => { parseAlertParams(args); },
    "color": async (color) => { banner.style.backgroundColor = color; },
    "setfollower": async (username) => { follower.innerText = `Latest Follower: ${username}`; },
    "settipper": async ([username, tip]) => { 
        if (username == "" || tip == "") return (tipper.innerText = `Last Donation: Err_Tip_Load_Failed`);
        tipper.innerText = `Last Donation: ${username} (${tip})`;
    },
    "message": async ([type, ...[transparent, ...message]]) => {
        console.log(type, transparent, message)
        if (type === "start") {
            MessageText.innerHTML = message.join(" ");
            MessageText.setAttribute("data-text", message.join(" "));

            document.body.style["background-color"] = (transparent === "true") ? "rgba(255,255,255,0)" : "rgba(0,0,0,1)";
            MessageText.style.opacity = 1;
        } else if (type === "end") {
            MessageText.innerHTML = "";
            MessageText.setAttribute("data-text", "");

            document.body.style["background-color"] = "rgba(255,255,255,0)"
            MessageText.style.opacity = 0;
        }
    }
}

ws.onmessage = (ev) => {
    const args = ev.data.split(' ');
    const command = args.shift();

    if (Object.keys(events).includes(command)) {
        events[command](args);
    }
};

window.onload = function () {
    MessageText.style.opacity = 0;
}