const colors = require('colors');

colors.setTheme({
    info: ['green', 'bold'],
    warn: ['yellow', 'bold'],
    error: ['red', 'bold'],
});

const log = (app, msg) => console.log(`[${app}] ${msg}`);
const info = (app, msg) => console.log(`${'[*]'.info} [${app}] ${msg}`);
const warn = (app, msg) => console.log(`${'[!]'.warn} [${app}] ${msg}`);
const err = (app, msg) => console.log(`${'[ERROR]'.error} [${app}] ${msg}`);

module.exports = { log, err, info, warn }