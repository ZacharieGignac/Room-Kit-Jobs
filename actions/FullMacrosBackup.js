const fs = require('fs');

exports.name = 'FullMacrosBackup';
exports.friendlyName = 'Full Macros Backup';
exports.version = '0.0.1';
exports.description = 'Backup all the endpoint macros and put them inside a folder (./macros/<endpoint name>)';

module.exports.action = async (system, params) => {
    var allMacros = await getAllMacros();
    for (const m of allMacros) {

        if (!fs.existsSync(`./macros/${system.name}`)) {
            console.log(`Creating directory ./macros/${system.name}`);
            fs.mkdirSync(`./macros/${system.name}`);
        }

        try {
            console.log(`Writing file ./macros/${system.name}/${m.Name}.js`)
            fs.writeFileSync(`./macros/${system.name}/${m.Name}.js`, m.Content);
        } catch (err) {
            console.error(err);
        }
    }
    system.actionDone();
}

async function getAllMacros() {
    const macros = await system.xapiClient.xapi.Command.Macros.Macro.Get({ Content:'True' });
    return macros.Macro;
}