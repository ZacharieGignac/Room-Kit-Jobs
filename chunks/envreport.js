var asciitable = require('ascii-table');
const AsciiTable = require('ascii-table/ascii-table');

exports.name = 'envreport';
exports.friendlyName = 'Environment Report';
exports.version = '0.0.1';
exports.description = 'Add the "envreport" command to display the result of multiple GetEnv actions';

module.exports.chunk = class {
    constructor(api, vars) {

        this.vars = vars;
        this.report = () => {
            var table = new AsciiTable(`Environmental Report`);
            table.setHeading('System', 'Temperature', 'Humidity', 'Air Quality');

            try {
                for (const env of this.vars['envreport']) {
                    table.addRow(env.system, env.temperature, env.humidity, env.airquality);
                }
                console.log(table.toString());
            }
            catch {
                console.log(`ENVREPORT: no data. You need to execute some GetEnv actions first!`)
            }

            



        }
        api.addCommand(this.report, 'envreport', 'Display the result of multiple GetEnv actions');
    }


}
