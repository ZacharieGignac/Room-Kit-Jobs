const jsxapi = require('jsxapi');

class Client {
    constructor(system, auth) {
        this.system = system;
        this.auth = auth;
        console.log(`[XAPICLIENT] INIT : System "${system.name}" (${system.address})`);
    }
    connect(runNextAction) {
        this.xapi = new jsxapi.connect(`ssh://${this.system.address}`, this.auth)
        .on('error', (err) => {
            console.error(`[XAPICLIENT] ERROR: ${this.system.name} -> ${err}`);
            this.system.connected = false;
        })
        .on('ready', async ($xapi) => {
            //console.log(`[XAPICLIENT] CONNECTED: ${this.system.name}`);
            this.system.connected = true;
            runNextAction(this.system);
        });
    }
    disconnect() {
        this.xapi.close();
        this.system.connected = false;
        console.log(`[XAPICLIENT] DISCONNECTED: ${this.system.name}`);
    }
}

module.exports = { Client }