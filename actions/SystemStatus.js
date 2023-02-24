var asciitable = require('ascii-table');
const AsciiTable = require('ascii-table/ascii-table');

exports.name = 'SystemStatus';
exports.friendlyName = 'System Status Report';
exports.version = '0.0.1';
exports.description = 'Displays current system status, including presence and environmental data (if available)';


module.exports.action = async (system, params) => {

    try {
        const presence = await system.xapiClient.xapi.Status.RoomAnalytics.PeoplePresence.get();
        const standby = await system.xapiClient.xapi.Status.standby.State.get();
        const version = await system.xapiClient.xapi.Status.SystemUnit.Software.Version.get();
        const uptime = await system.xapiClient.xapi.Status.SystemUnit.Uptime.get();
        const activeCalls = await system.xapiClient.xapi.Status.SystemUnit.State.NumberOfActiveCalls.get();

        var table = new AsciiTable(`System Status for ${system.name}`);
        table
            .setHeading('Status', 'Value')
            .addRow('Presence', presence)
            .addRow('Standby Status', standby)
            .addRow('Software Version', version)
            .addRow('Uptime', uptime)
            .addRow('Active calls', activeCalls)

        console.log(table.toString());
    }
    catch (error) {
        console.log(error);
    }

    system.actionDone();
}
