/* 

USAGE
action add xCommand command json params

EXAMPLE
action add xCommand UserInterface Message Alert Display { "Duration":5, "Text":"It's working!", "Title":"Good news!" }



*/


exports.name = 'xCommand';
exports.friendlyName = 'XAPI xCommand';
exports.version = '0.0.1';
exports.description = 'Run a XAPI xCommand';



exports.action = async (system, params, vars) => {
    var paramsSplit = params.split('{');
    var command = paramsSplit[0];
    
    


    if (paramsSplit.length > 1) {
        var jsonParam = '{ ' + paramsSplit[1].trim();
    var paramObject = JSON.parse(jsonParam);
        system.xapiClient.xapi.command(command, paramObject).catch(err => console.error(`[XCOMMAND ERROR] ${err.message} (${params})`));
        
    }
    else {
        system.xapiClient.xapi.command(command).catch(err => console.log(`[XCOMMAND ERROR] Missing parameters!`));
    }
    

    system.actionDone();

}

function getArrStr(arr, start, end = arr.length) {
    return arr.slice(start, end).join(' ');
}

function createObjectFromString(inputString) {
    const obj = {};
    const properties = inputString.split(' ');

    for (let i = 0; i < properties.length; i++) {
        const [key, value] = properties[i].split(':');
        obj[key] = isNaN(value) ? value : parseInt(value);
    }

    return obj;
}