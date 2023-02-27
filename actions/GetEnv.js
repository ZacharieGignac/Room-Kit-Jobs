exports.name = 'GetEnv';
exports.friendlyName = 'Get Environnement Status';
exports.version = '0.0.1';
exports.description = 'Displays the current environnement data, including Temperature, Relative Humidity and Air Quality Index';


module.exports.action = async (system, params, vars) => {

    try {
        var temperature, humidity, airquality = 'Unknown';

        var devices = await system.xapiClient.xapi.Status.Peripherals.ConnectedDevice.get();
        for (const device of devices) {
            if (device.RoomAnalytics) {
                temperature = device.RoomAnalytics.AmbientTemperature;
                humidity = device.RoomAnalytics.RelativeHumidity;
                airquality = device.RoomAnalytics.AirQuality.Index;
                console.log(`[${system.name}] Getting environment data...`);
                
                //init report memory space
                if (!vars['envreport']) {
                    vars['envreport'] = [];
                }

                //push report result
                vars['envreport'].push({ system:system.name, temperature:temperature, humidity:humidity, airquality:airquality });
            }
        }
        system.actionDone();

    }
    catch (error) {
        console.log(`GetEnv error (might not be critical) -> ${error.message} (system need a roomnav)`);
    }


}
