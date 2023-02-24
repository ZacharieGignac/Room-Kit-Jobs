import xapi from 'xapi';
import * as yapi from './yapi';

const simulateCommunicationLoss = false;

export class flex232 extends yapi.Module {
  constructor(instanceName, config) {
    super(instanceName);
    this.name = 'flex232';
    this.description = 'Global caché flex rs-232 driver';
    this.functionalities = [yapi.functionalities.CONTROLSYSTEM.COMMUNICATION, yapi.functionalities.DISPLAY.CONTROLLER];
    return this.name;
  }
  init() {

  }

  sendDeviceCommand(command) {

console.log('Command to flex232:');
console.log(command);
  }
}

