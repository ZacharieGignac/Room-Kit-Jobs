const black = "\x1b[30m"
const red = "\x1b[31m"
const green = "\x1b[32m"
const yellow = "\x1b[33m"
const blue = "\x1b[34m"
const magenta = "\x1b[35m"
const cyan = "\x1b[36m"
const wite = "\x1b[37m"
const gray = "\x1b[90m"
const reset = "\x1b[0m"
const bright = "\x1b[1m"
const dim = "\x1b[2m"
const underscore = "\x1b[4m"
const blink = "\x1b[5m"
const reverse = "\x1b[7m"
const hidden = "\x1b[8m"
const bgBlack = "\x1b[40m"
const bgRed = "\x1b[41m"
const bgGreen = "\x1b[42m"
const bgYellow = "\x1b[43m"
const bgBlue = "\x1b[44m"
const bgMagenta = "\x1b[45m"
const bgCyan = "\x1b[46m"
const bgWhite = "\x1b[47m"
const bgGray = "\x1b[100m"


const foregroundColors = [];
foregroundColors["black"] = "\x1b[30m";
foregroundColors["red"] = "\x1b[31m";
foregroundColors["green"] = "\x1b[32m";
foregroundColors["yellow"] = "\x1b[33m";
foregroundColors["blue"] = "\x1b[34m";
foregroundColors["magenta"] = "\x1b[35m";
foregroundColors["cyan"] = "\x1b[36m";
foregroundColors["wite"] = "\x1b[37m";
foregroundColors["gray"] = "\x1b[90m";

function colorForeground(color, text) {
    return `${foregroundColors[color]}${text}${reset}`;
}

exports.black = (text) => { return colorForeground('black',text) }
exports.red = (text) => { return colorForeground('red',text) }
exports.green = (text) => { return colorForeground('green',text) }
exports.yellow = (text) => { return colorForeground('yellow',text) }
exports.blue = (text) => { return colorForeground('blue',text) }
exports.magenta = (text) => { return colorForeground('magenta',text) }
exports.cyan = (text) => { return colorForeground('cyan',text) }
exports.white = (text) => { return colorForeground('white',text) }
exports.gray = (text) => { return colorForeground('gray',text) }
