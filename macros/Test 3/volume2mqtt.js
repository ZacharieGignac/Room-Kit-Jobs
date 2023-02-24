import xapi from 'xapi';

const BASE64AUTH = 'dGVzdDp0ZXN0MTI';


const AUTHBASE64 = `Authorization: Basic ${BASE64AUTH}`;
const TOKEN = 'Token: UFZFMTExNS9EZXNrUHJv';

console.log(AUTHBASE64);
var topic_Volume = 'rooms/PVE/1115/devices/DeskPro/volume';
var topic_Presence = 'rooms/PVE/1115/devices/DeskPro/Presence';
var topic_Temperature = 'rooms/PVE/1115/Temperature';



async function postMQTT(topic, value) {
  var payload = { topic: topic, value: value };
  var result = await xapi.Command.HttpClient.Post({
    AllowInsecureHTTPS: true,
    Header: [AUTHBASE64, TOKEN],
    ResultBody: 'PlainText',
    Url: `http://10.1.48.250:1880/mqttbridge/v1`
  },
    `${JSON.stringify(payload)}`
  );
  console.log(result);
}



xapi.Status.Audio.Volume.on(async vol => {
  await postMQTT(topic_Volume, vol);
});

xapi.Status.Audio.Volume.get().then(async vol => {
  await postMQTT(topic_Volume, vol);
});

xapi.Status.RoomAnalytics.PeoplePresence.get().then(async presence => {
  await postMQTT(topic_Presence, presence);
});
xapi.Status.RoomAnalytics.PeoplePresence.on(async presence => {
  await postMQTT(topic_Presence, presence);
});

setInterval(() => {
  const temp = xapi.Status.RoomAnalytics.AmbientTemperature.get().then(t => {
    postMQTT(topic_Temperature,t);
  });

}, 60000);



