import xapi from 'xapi';

const rebootTime = '15:37';

function schedule(time, action) {
  let [alarmH, alarmM] = time.split(':');
  let now = new Date();
  now = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  let difference = parseInt(alarmH) * 3600 + parseInt(alarmM) * 60 - now;
  if (difference <= 0) difference += 24 * 3600;
  return setTimeout(action, difference * 1000);
}



function dialMeeting() {

  
}



function test() {
  console.log(`IT WORKS!!!!!!!!!!!`);
}


schedule(rebootTime, test);