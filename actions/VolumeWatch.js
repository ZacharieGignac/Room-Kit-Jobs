exports.name = 'volumewatch';
exports.friendlyName = 'Volume Display and Watch';
exports.version = '0.0.1';
exports.description = 'Displays the current volume level, and display any change';


module.exports.action = async (system, params) => {

    try {
        const currentVolume = await system.xapiClient.xapi.Status.Audio.Volume.get();
        console.log(`[VOLUMEWATCH] ${system.name} current volume: ${currentVolume}`);
        system.xapiClient.xapi.Status.Audio.Volume.on(vol => {
            console.log(`[VOLUMEWATCH] ${system.name} new volume: ${vol}`);
        });
    }
    catch (error) {
        console.log(error);
    }

    system.actionDone(true);
}
