import xapi from 'xapi';

const mem = require('./Memory_Functions');

async function bench() {
  let ticks = new Date().getTime();
  await mem.mem.write('ticks', ticks);
  let pastTicks = await mem.mem.read('ticks');
  console.log(new Date().getTime() - pastTicks + 'ms');
  bench();
}

bench();

/*
await xapi.config.get('Audio Ultrasound MaxVolume').then(level => {
  await mem.write('UltrasoundMaxVolume', level)
}).catch(error => {
  console.error("101" + error);
});
*/