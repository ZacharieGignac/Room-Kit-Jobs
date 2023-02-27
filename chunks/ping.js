exports.name = 'ping';
exports.friendlyName = 'ping';
exports.version = '0.0.1';
exports.description = 'Add the "ping" command to ping all loaded systems at once!';

module.exports.chunk = class {
    constructor(api) {
        var that = this;
        api.addCommand(that.pong, 'ping', 'Get pong for free!');
    }
    pong() {
        console.log('PONG!');
    }
}
