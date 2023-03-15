

exports.name = 'enableMidCallControls';
exports.friendlyName = 'Enable Mid Call Controls';
exports.version = '0.0.1';
exports.description = 'Enable buttons like record, hold, transfer, add while in call';

module.exports.action = async (system, params) => {
    try {
        const xapi= await system.xapiClient.xapi;
        xapi.Config.UserInterface.Features.Call.MidCallControls.set('Auto');
        console.log(`[${system.name}] -> Mid Call Controls set to AUTO`);
    }
    catch (error) {
        console.log(error);
        
    }
    system.actionDone();
}
