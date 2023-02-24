import xapi from 'xapi';
import * as yapi from './yapi';

const simulateCommunicationLoss = false;

export class communication extends yapi.Module {
  constructor(instanceName, config) {
    super(instanceName);
    this.name = 'crestron';
    this.description = 'Crestron controller using messages';
    this.functionalities = [yapi.functionalities.CONTROLSYSTEM.COMMUNICATION];
    /*
    this.updateUi = function () {
      console.log('Updaté (module)');
    }
    */
    return this.name;
  }
  init() {
    /*
    this.toasts = this.controller.modules.getModuleByInstanceName('notifications.toasts');
    this.toasts.display('Crestron controller', 'Waiting for crestron SSH connection...',3000);
    this.controller.communication.broadcastEvent(new api.Event('controlsystem','ready',false));
    */
    const crestronCommunicationCheck = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (simulateCommunicationLoss) {
            reject('Communication intérompue avec le processeur Crestron.');
          }
          else {
            resolve();
          }
        }, 1000);
      });
    }
    yapi.systemCheck.addSystemReadyCondition(crestronCommunicationCheck);
  }

  sendDeviceCommand(deviceName, deviceCommand, deviceParams) {

    if (deviceParams != undefined) {
      deviceParams = '_' + deviceParams;
    }
    else {
      deviceParams = '';
    }

    xapi.Command.Message.Send({
      text: `${deviceName}_${deviceCommand}${deviceParams}`
    });
  }

  log(text) {
    console.warn(text);
  }
}

