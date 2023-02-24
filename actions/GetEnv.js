exports.name = 'GetEnv';
exports.friendlyName = 'Get Environnement Status';
exports.version = '0.0.1';
exports.description = 'Displays the current environnement data, including Temperature, Relative Humidity and Air Quality Index';


module.exports.action = async (system, params) => {

    try {
        var temperature, humidity, airquality = 'Unknown';

        var devices = await system.xapiClient.xapi.Status.Peripherals.ConnectedDevice.get();
        for (const device of devices) {
            if (device.RoomAnalytics) {
                temperature = device.RoomAnalytics.AmbientTemperature;
                humidity = device.RoomAnalytics.RelativeHumidity;
                airquality = device.RoomAnalytics.AirQuality.Index;
                console.log(`[${system.name}] Temperature:${temperature} Humidity:${humidity} AirQuality:${airquality}`);
            }
        }


    }
    catch (error) {
        console.log(error);
    }

    system.actionDone();
}
