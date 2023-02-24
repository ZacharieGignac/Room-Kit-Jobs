const jsxapi = require('jsxapi');
const fs = require('fs');




var auth = {
    username: 'zagig',
    password: 'Ieidm2f++'
};

var systemList = [
    '10.12.48.111',
];

var macrosList = [
    'RoomConfig',
    'ce-audio-config',
];

var currentSystem = 0;

const sleep = (timeout) => new Promise((resolve) => {
    setTimeout(resolve, timeout);
});

function processNext() {
    if (currentSystem < systemList.length) {
        connectToSystem(systemList[currentSystem]);
        currentSystem++;
    }
    else {
        console.log('Done');
    }
}

async function connectToSystem(system) {
    console.log(`Connecting to ${system}`);
    jsxapi.connect(`ssh://${system}`, auth)
        .on('error', console.error)
        .on('ready', async (xapi) => {
            for (var i = 0; i < macrosList.length; i++) {
                //await sleep(10000);
                console.log(`Getting macro ${macrosList[i]} (${i + 1}/${macrosList.length})`);
                try {
                    var m = await getMacro(xapi, macrosList[i]);

                    console.log('Got macro');
                    console.log('Writing file...');
                    if (!fs.existsSync(`./macros/${system}`)) {
                        fs.mkdirSync(`./macros/${system}`);
                    }

                    try {
                        fs.writeFileSync(`./macros/${system}/${macrosList[i]}.js`, m.Content);
                        // fichier écrit avec succès
                    } catch (err) {
                        console.error(err);
                    }
                }
                catch (err) {
                    
                }
            }
            xapi.close();
            processNext();
        });

}

async function getMacro(xapi, macroName) {
    try {
        var macro = await xapi.Command.Macros.Macro.Get({ Content: true, Name: macroName });
    }
    catch (error) {
        console.log(`Macro ${macroName} not found. Skipping.`);
    }
    return macro.Macro[0];
}

processNext();