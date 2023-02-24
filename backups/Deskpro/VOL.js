import xapi from 'xapi';
var standbyLevel;

xapi.status.on('Standby', async (state) => {
  switch(state.State) {
        case "Standby": {
          console.log('Standby State = '+state.State);
          standbyLevel = await xapi.Status.Audio.Volume.get();
          console.log("Standby level:" + standbyLevel);
          xapi.Command.Audio.Volume.Set({
            Level: 50
          });
          standbyLevel = await xapi.Status.Audio.Volume.get();
          console.log("Standbylevel after standby:" + standbyLevel);
          break;
        }
  }
}); 