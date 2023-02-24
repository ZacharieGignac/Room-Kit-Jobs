import xapi from 'xapi';

const IP = '10.1.48.12';
const USERNAME = 'zagig';
const PASSWORD = 'abcd1234';

var _cookie = [];


async function getTrackId(ip) {
  var result = await xapi.Command.HttpClient.Get({
    AllowInsecureHTTPS: true,
    ResultBody: 'PlainText',
    Url: `https://${ip}/userlogin.html`
  });

  var temptrackid;
  for (var header of result.Headers) {
    if (header.Key = 'Set-Cookie') {
      //console.log(header.Value);
      if (header.Value.substring(0, 7) == 'TRACKID') {
        temptrackid = header.Value.substring(header.Value.indexOf('=') + 1, header.Value.indexOf(';'));
        return temptrackid;
      }
    }
  }
}

async function login(ip, username, password, trackid) {
  var header_Cookie = `Cookie: TRACKID=${trackid}`;
  var header_Origin = `Origin: https://${ip}`;
  var header_referer = `Referer: https://${ip}/userlogin.html`;
  var receivedCookie = [];

  var result = await xapi.Command.HttpClient.Post({
    AllowInsecureHTTPS: true,
    Header: [header_Cookie, header_Origin, header_referer],
    ResultBody: 'PlainText',
    Url: `https://${ip}/userlogin.html`
  },
    `login=${username}&passwd=${password}`
  );
  var newCookie = 'Cookie: ';
  for (var header of result.Headers) {
    if (header.Key == 'Set-Cookie') {

      /*
      var cookieKey = header.Value.split(';')[0].split('=')[0];
      var cookieValue = header.Value.split(';')[0].split('=')[1];
      */
      var key = header.Value.split('=')[0];
      if (key == 'AuthByPasswd' || key == 'TRACKID' || key == 'iv' || key == 'tag' || key == 'userid' || key == 'userstr') {
        newCookie = newCookie + header.Value;
      }

    }
  }
  console.log(newCookie);
  return newCookie;
}

async function testRequest(ip, cookie) {
  var result = await xapi.Command.HttpClient.Get({
    AllowInsecureHTTPS: true,
    Header: cookie,
    ResultBody: 'PlainText',
    Url: `https://${ip}/Device/DeviceInfo`
  });
  console.log(result);

}

async function changeOsd(ip, cookie) {

  var result = xapi.Command.HttpClient.Post({
    AllowInsecureHTTPS: true,
    Header: [cookie, `Content-Type: application/json`],
    ResultBody: 'PlainText',
    Url: `https://${ip}/Device/Osd/`
  }, `{"Device":{"Osd":{"IsEnabled":true,"Text":"Crestron est vraiment bizarre"}}}
  
  `).then(result => {
    console.log(result);
  }).catch(err => {
    console.error(err);
  });

}


async function init() {
  var trackid = await getTrackId(IP);
  var c = await login(IP, USERNAME, PASSWORD, trackid);
  //testRequest(IP, c);
  changeOsd(IP, c);
}

init();

