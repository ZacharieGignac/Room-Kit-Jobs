var asciitable = require('ascii-table');
const AsciiTable = require('ascii-table/ascii-table');

exports.name = 'GetVersion';
exports.friendlyName = 'Get Codec Version';
exports.version = '0.0.1';
exports.description = 'Displays the current software version';


module.exports.action = async (system, params, vars) => {

    try {
        const version = await system.xapiClient.xapi.Status.SystemUnit.Software.Version.get();
        console.log(`[${system.name}] VERSION ${version}`);
    }
    catch (error) {
        console.log(`[${system.name}] Error connecting.`);
    }

    system.actionDone();
}
