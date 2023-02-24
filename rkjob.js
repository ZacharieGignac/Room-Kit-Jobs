
const xapiClient = require('./xapiClient.js');
const { exit } = require('process');
const readline = require('readline');
const fs = require('fs');
const color = require('./colors.js');
const AsciiTable = require('ascii-table/ascii-table');
const { parse } = require('path');
const os = require('os');
const { isGeneratorFunction } = require('util/types');


const version = '0.0.1';

var auth = {
    username: 'zagig',
    password: 'Ieidm2f++'
};


var currentSystem = 0;
var commands = [];
var vars = [];
var running = false;
var remainingJobScript;
var jobStartTime;

const sleep = (timeout) => new Promise((resolve) => {
    setTimeout(resolve, timeout);
});


var systems = [];

function getArrStr(arr, start, end = arr.length) {
    return arr.slice(start, end).join(' ');
}


function initSystems() {
    running = true;
    for (const system of systems) {
        system.keepRunningActions = [];
        system.actionDone = (keepRunning) => {
            //console.log(`[ACTION] System '${system.name}' just finished action '${system.currentAction.action}'`);
            runNextAction(system, keepRunning);
        };


        system.xapiClient = new xapiClient.Client(system, auth);
    }
    connectSystems();
}
function connectSystems() {
    for (const system of systems) {
        system.xapiClient.connect(runNextAction);
    }
}
function disconnectSystems() {
    for (const system of systems) {
        system.xapiClient.disconnect();
    }
}

function readLineAndExecute(callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', (input) => {
        callback(input);
    });
}

function getActionsNames(actions) {
    var returnStr = [];
    for (const action of actions) {
        returnStr.push(action.action);
    }
    return returnStr;
}

function addAction(actionName, params) {
    try {
        let tempAction = require(`./actions/${actionName}`);
        for (system of systems) {
            system.actions.push({ action: actionName, params: params });
        }
        console.log(`[ACTION] Adding '${actionName}' to systems with params '${params}'`);
    }
    catch (error) {
        console.error(color.red(`[ERROR] ${error}`));
    }

}

function runAction(actionName, params) {
    console.log(`[ACTION] Running action '${actionName}'`);
    for (const system of systems) {
        system.actions.splice(0, 0, { action: actionName, params: params });
        runNextAction(system);
    }
}

function listActions() {
    fs.readdir('./actions', (err, files) => {
        var table = new AsciiTable(`Available actions`);
        table.setHeading('Name', 'Friendly Name', 'Version', 'Description');
        for (const file of files) {
            let tempReq = require(`./actions/${file}`);
            table.addRow(tempReq.name, tempReq.friendlyName, tempReq.version, tempReq.description);
        }
        console.log(table.toString());
        if (systems.length > 0) {
            var table2 = new AsciiTable(`Current actions`);
            table2.setHeading('System name', 'Address', 'Current action', 'Actions stack', 'Keeps Running');
            for (const system of systems) {
                table2.addRow(system.name, system.address, system.currentAction, getActionsNames(system.actions), getRunningActionsText(system.keepRunningActions));
            }
            console.log(table2.toString());
        }
    });
}

function getRunningActionsText(arr) {
    var actionNames = [];
    if (arr.length > 0) {
        for (const a of arr) {
            actionNames.push(a.action);
        }
        return actionNames.join(',');
    }
    else {
        return '';
    }
}



function runNextAction(system, keepRunning) {
    if (running) {
        if (countRemainingActions() == 0) {
            running = false;
            if (isKeepRunningActions()) {
                executeJobScript();
                setTimeout(() => {
                    console.log(`[JOB] Done. Some actions are still running. Use 'actions list' for details.`)
                    console.log(`[JOB] Elapsed time : ${calculateElapsedTimeInSeconds(jobStartTime,new Date())} seconds`);
                }, (1000));

            }
            else {
                setTimeout(() => {
                    console.log(`[JOB] Done.`);
                    console.log(`[JOB] Elapsed time : ${calculateElapsedTimeInSeconds(jobStartTime,new Date())} seconds`);
                    executeJobScript();
                    if (vars["exit"]) {
                        setTimeout(() => process.exit(0), vars["exit"]);
                    }
                }, 1000);

            }
            
        }
    }
    if (keepRunning) {
        system.keepRunningActions.push(system.currentAction);
    }
    system.currentAction = undefined;
    if (system.actions.length > 0) {
        system.currentAction = system.actions.shift();
        //console.log(`[ACTIONS] Running action '${system.currentAction.action}' on system '${system.name}'`);
        try {
            var newAction = require(`./actions/${system.currentAction.action}`);
            if (system.connected) {
                newAction.action(system, system.currentAction.params);
            }
            else {
                console.log(`[ACTION ERROR] Can't run action ${newAction.name} on ${system.name}, not connected. Use 'run' to connect all systems.`);
            }
        }
        catch (err) {
            console.log(`[ACTION ERROR] ${err.code}`);
        }
    }
}



function isKeepRunningActions() {
    for (const system of systems) {
        if (system.keepRunningActions.length > 0) return true;
    }
    return false;
}

function countRemainingActions() {
    var remaining = 0;
    for (const system of systems) {
        remaining += system.actions.length;
    }
    return remaining;
}



function commandActions(input) {
    var inputSplit = input.split(' ');
    if (inputSplit[1] == 'add') {
        if (inputSplit[2]) {
            addAction(inputSplit[2], getArrStr(inputSplit, 3));
        }
        else {
            console.log(`[ERROR] Use correct syntax: action add <ActionName>`);
        }
    }
    else if (inputSplit[1] == 'run') {
        if (inputSplit[2]) {
            runAction(inputSplit[2], getArrStr(inputSplit, 3));
        }
        else {
            console.log(`[ERROR] Use correct syntax: action run <ActionName>`);
        }
    }
    else if (inputSplit[1] == 'list') {
        listActions();
    }
    else {
        console.log(color.red(`[ERROR] Use correct syntax: actions list`));
    }
}

function systemsCommand(input) {
    var inputSplit = input.split(' ');
    var systemsCommand = inputSplit[1];
    if (systemsCommand == 'add') {
        var systemInfo = inputSplit.slice(2, inputSplit.length).join(' ');
        var systemInfoSplit = systemInfo.split(',');
        var name = systemInfoSplit[0];
        var address = systemInfoSplit[1];
        var username = systemInfoSplit[2];
        var password = systemInfoSplit[3];

        addSystem(name, address, username, password);
    }
    else if (systemsCommand == 'load') {
        console.log(`[SYSTEMS] Loading system address book '${inputSplit[2]}'`);
        const loadedSystems = readAddressBookFile(inputSplit[2]);
        for (const system of loadedSystems) {
            addSystem(system.name.trim(), system.address.trim(), system.username.trim(), system.password.trim());
        }
        console.log(`[SYSTEMS] Loading completed.`);
    }
    else if (systemsCommand == 'list') {
        if (systems.length > 0) {
            var table = new AsciiTable(`Systems list`);
            for (const system of systems) {
                table
                    .setHeading('Name', 'Address', 'Connected', 'Username', 'Password (hidden)')
                    .addRow(system.name, system.address, system.connected, system.username, "*".repeat(system.password.length))
            }
            console.log(table.toString());
        }
        else {
            console.log(`[SYSTEMS] Can't list system. List is empty!`);
        }
    }
}

function jobCommand(input) {
    var inputSplit = input.split(' ');
    var jobCommand = inputSplit[1];
    if (jobCommand == 'load') {
        var jobFile = inputSplit[2];
        setJobScript(jobFile);
    }
    else {
        console.log(`[JOB] Unknown command. Try job load <file>`);
    }
}
function setCommand(input) {
    var inputSplit = input.split(' ');
    var name = inputSplit[1];
    var value = input.substring(inputSplit[0].length + inputSplit[1].length + 2);
    vars[name] = value;
}
function getCommand(input) {
    var inputSplit = input.split(' ');
    var name = inputSplit[1];
    console.log(vars[name]);
}

function addSystem(name, address, username, password) {
    systems.push({
        name: name,
        address: address,
        username: username,
        password: password,
        currentAction: undefined,
        actions: [],
        keepRunningActions: [],
        connected: false
    });
    console.log(`[SYSTEMS] Added '${name}' (${address})`);
}

function readAddressBookFile(file) {
    const fileContent = fs.readFileSync(`./addressbooks/${file}`, 'utf-8');
    const lines = fileContent.split(os.EOL);
    const objects = lines.map(line => {
        const [name, address, username, password] = line.trim().split(',');
        return { name, address, username, password };
    });
    return objects;
}

function log(text) {
    console.log(text);
}

async function setJobScript(file) {
    console.log(`[JOB] Setting job script ${file}`);
    const fileContent = fs.readFileSync(`./jobscripts/${file}`, 'utf-8');
    
    const lines = fileContent.split(os.EOL);
    remainingJobScript = lines;    
    executeJobScript();
}
async function executeJobScript() {
    console.log(`[JOB] Executing jobs (${remainingJobScript.length} remaining)`);
    while (remainingJobScript.length > 0) {
        var line = remainingJobScript[0];
        var lineSplit = line.split(' ');
        if (lineSplit[0] == 'sleep') {
            const sleepTime = parseInt(lineSplit[1]);
            await sleep(sleepTime);
        }
        else if (lineSplit[0].substring(0, 1) == '#') {  }
        else {
            if (line == 'then') {
                console.log(`[JOB] Pausing execution due to 'then' statement. Will resume when current job is done.`);
                remainingJobScript.splice(0,1);
                break;
            }
            else {
                parseCommand(line);
            }
        }
        remainingJobScript.splice(0, 1);        
    }
    console.log(`[JOB] Execution finished.`);
}

function parseCommand(input) {

    var commandName = input.split(' ')[0];
    commandsMatch = commands.filter(c => c.name == commandName);
    if (commandsMatch.length > 0) {
        for (const c of commandsMatch) {
            c.func(input);
        }
    }
    else {
        console.log(`[ERROR] Unknown command '${commandName}'`);
    }

}

function calculateElapsedTimeInSeconds(startTime, endTime) {
    const elapsedMilliseconds = endTime.getTime() - startTime.getTime();
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    return elapsedSeconds;
}

function cmdLog(input) {
    log(input.substring(4));
}
function cmdExit(input) {
    console.log('Bye');
    process.exit(0);
}
function cmdAction(input) {
    commandAction(input);
}
function cmdActions(input) {
    commandActions(input);
}
function cmdSystems(input) {
    systemsCommand(input);
}
function cmdRun(input) {
    jobStartTime = new Date();
    initSystems();
}
function cmdJob(input) {
    jobCommand(input);
}
function cmdSet(Input) {
    setCommand(Input)
}
function cmdGet(Input) {
    getCommand(Input);
}

function cmdHelp() {
    var table = new AsciiTable(`Available commands`);
    table.setHeading('Command', 'Description');
    for (const command of commands) {
        table.addRow(command.name, command.description);
    }
    console.log(table.toString());
}

readLineAndExecute((input) => {
    parseCommand(input);
});



function addCommand(func, name, description) {
    commands.push({ name: name, func: func, description: description });
    console.log(`[SYSTEM] Added command '${name}'`);
}
function registerCommands() {
    addCommand(cmdLog, 'log', 'Logs text to console');
    addCommand(cmdExit, 'exit', 'Exits the program');
    addCommand(cmdActions, 'actions', 'actions add <action>, actions list');
    addCommand(cmdSystems, 'systems', 'systems load');
    addCommand(cmdRun, 'run', 'run the job!');
    addCommand(cmdJob, 'job', 'job load');
    addCommand(cmdSet, 'set', 'Set an environnement variable to a value');
    addCommand(cmdGet, 'get', 'Displays an environnement variable');
    addCommand(cmdHelp, 'help', 'Get help');
}



console.log(color.red(`RKJOB ${version}`));
registerCommands();
if (process.argv[2]) {
    parseCommand(`job load ${process.argv[2]}`);
}
else {
    console.log(`Running interactive prompt:`);
}

var api = {
    addCommand: addCommand,
    log: log
}
var testReq = require('./chunks/ping.js');
const { description } = require('./actions/GetVideoStatus');
var chunk = new testReq.chunk(api);