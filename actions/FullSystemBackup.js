const fs = require('fs');

exports.name = 'FullSystemBackup';
exports.friendlyName = 'Full System Backup';
exports.version = '0.0.1';
exports.description = 'Backup all the endpoint macros and put them inside a folder (./backups/<endpoint name>). Also pulls the config as config.json';

module.exports.action = async (system, params) => {
    const backupDate = new Date().toLocaleDateString() + "_BACKUP";
    var allMacros = await getAllMacros(system.xapiClient.xapi);
    for (const m of allMacros) {
        if (!fs.existsSync(`./backups`)) {
            fs.mkdirSync(`./backups`);
        }
        if (!fs.existsSync(`./backups/${system.name}-${backupDate}`)) {
            console.log(`Creating directory ./backups/${system.name}-${backupDate}`);
            fs.mkdirSync(`./backups/${system.name}-${backupDate}`);
        }

        try {
            console.log(`Writing file ./backups/${system.name}-${backupDate}/${m.Name}.js`)
            fs.writeFileSync(`./backups/${system.name}-${backupDate}/${m.Name}.js`, m.Content);
        } catch (err) {
            console.error(err);
        }
    }
    const config = await getConfig(system.xapiClient.xapi);
    console.log(`Writing file ./backups/${system.name}-${backupDate}/config.json`);
    fs.writeFileSync(`./backups/${system.name}-${backupDate}/config.json`, config);
    system.actionDone();
}

async function getAllMacros(xapi) {
    const macros = await xapi.Command.Macros.Macro.Get({ Content:'True' });
    return macros.Macro;
}
async function getConfig(xapi) {
    const config = await xapi.Config.get();
    return JSON.stringify(config);
}