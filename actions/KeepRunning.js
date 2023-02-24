exports.name = 'KeepRunning';
exports.friendlyName = 'Keep Running';
exports.version = '0.0.1';
exports.description = 'Tricks the job to keep running forever, will not exit after execution';


module.exports.action = async (system, params) => { system.actionDone(true); }
