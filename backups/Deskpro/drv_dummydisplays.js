import xapi from 'xapi';

export class dummytv {
  constructor(deviceController, displayController) {
    console.log(`[DUMMYDISPLAYS.DUMMYTV]: loaded by instance ${displayController.instanceName}`);
    this.deviceController = deviceController;
    this.displayController = displayController;

    
  }
  sendCommand(command) {
    if (command.command == 'POWER' && command.value == 'ON') {
      command.rawCommand = 'PWR1\r\n';
      this.deviceController.sendDeviceCommand(command);
      this.displayController.displayFeedback({ status:'ON' });
    }
    else if (command.command == 'POWER' && command.value == 'OFF') {
      command.rawCommand = 'PWR0\r\n';
      this.deviceController.sendDeviceCommand(command);
      this.displayController.displayFeedback({ status:'OFF' });
    }

  }
}