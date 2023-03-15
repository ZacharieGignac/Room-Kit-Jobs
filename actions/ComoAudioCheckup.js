exports.name = 'SetAECVolumeControlOff';
exports.friendlyName = 'Set AEC Volume Control Off';
exports.version = '0.0.1';
exports.description = 'Check if the system have a AEC group, if so, sets the VolumeControlled property to "Off';


module.exports.action = async (system, params, vars) => {
    try {
        var xapi = system.xapiClient.xapi;
        var outputs = await xapi.Status.Audio.Output.LocalOutput.get();

        for (const out of outputs) {

            if (out.Name == 'AEC') {
                if (out.VolumeControlled == 'On') {
                    console.log(`[${system.name}] AEC "VolumeControlled" property is set to "On" and should be set to "Off". Add parameter "fix" to automatically fix.`);
                    if (params == 'fix') {
                        //out.LousSpeaker = 'Off';
                        console.log(`[${system.name}] Setting AEC VolumeControlled to 'Off`);
                    }
                }
                if (out.LoudSpeaker == 'Off') {
                    console.log(`[${system.name}] AEC "Loudspeaker" property is set to "Off" and should be set to "On". Add parameter "fix" to automatically fix.`)
                    console.log('|' + params + '|');
                    if (params == 'fix') {
                        console.log(`FIXING!!!!!!!`);
                        for (const outls of outputs) {
                            //out.Loudspeaker = 'Off';
                            console.log(`[${system.name}] Setting ${outls.Name} loudspeaker to 'Off`);
                        }
                        console.log(`[${system.name}] Setting AEC Loudspeaker to "On"`);
                        //out.Loudspeaker
                    }
                }
                /*
                if (out.VolumeControlled == 'On') {
                    console.log(`${system.name} AEC volume control is currently set to ON. Fixing.`);
                    
                    xapi.Command.Audio.LocalOutput.Update({
                        OutputId: out.id,
                        VolumeControlled: 'Off'
                    });
                    
                }
                else {
                    console.log(`${system.name} AEC volume control is already set to OFF. Skipping.`);
                }
                */
            }
            else if (out.Name == 'RECORDING') {
                if (out.VolumeControlled == 'On') {
                    console.log(`[${system.name}] RECORDING VolumeControlled is set to "On" and should be set to "Off". Add parameter "fix" to automatically fix.`)

                }
                if (out.LoudSpeaker == 'Off') {
                    console.log(`[${system.name}] RECORDING VolumeControlled is set to "On" and should be set to "Off". Add parameter "fix" to automatically fix.`)

                }
            }
        }
        system.actionDone();

    }
    catch (error) {
        console.log(error)
    }


}

