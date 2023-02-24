var asciitable = require('ascii-table');
const AsciiTable = require('ascii-table/ascii-table');

exports.name = 'Vacant';
exports.friendlyName = 'Get vacant rooms';
exports.version = '0.0.1';
exports.description = 'Get vacant rooms. Only output something if vacant.';

module.exports.action = async (system, params) => {
    try {
        const presence = await system.xapiClient.xapi.Status.RoomAnalytics.PeoplePresence.get();
        if (presence == 'No') {
            console.log(`[VACANT] ${system.name} is vacant.`);
        }
        system.actionDone();
    }
    catch (error) {
        console.log(error);
        system.actionDone();
    }

    
}
