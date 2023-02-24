import xapi from 'xapi';
import * as yapi from './yapi';

export var base = 'displaycontroller';

export class display extends yapi.Module {
  constructor(instanceName, config) {
    super(instanceName);
    this.instanceName = instanceName;
    this.name = 'display';
    this.description = 'Display controller';
    this.functionalities = [yapi.functionalities.DISPLAY.MANAGER];
    this.displayOffTimer = undefined;
    this.displayName = config.name;
    this.offDelay = config.offDelay;
    this.status = config.status;
    this.debug = config.debug;
    this.deviceControllerInstanceName = config.deviceControllerInstanceName;

    this.deviceDriverConfig = config.deviceDriver;



    return this.name;
  }
  init() {
    this.deviceController = yapi.modules.getModuleByInstanceName(this.deviceControllerInstanceName);

    /* Load display driver */
    console.log(`[DISPLAYCONTROLLER.DISPLAY(${this.instanceName})] using driver ${this.deviceDriverConfig.lib}.${this.deviceDriverConfig.driver}`);
    var deviceDriverRequire = require(`./${this.deviceDriverConfig.lib}`);
    this.deviceDriver = new deviceDriverRequire[this.deviceDriverConfig.driver](this.deviceController, this);



    if (this.status == 'on') {
      this.on();
    }
    else {
      this.off(0);
    }


  }
  on() {
    if (this.debug)
      console.log(`[${this.instanceName}] ${this.displayName}_POWER_ON`);
    this.deviceDriver.sendCommand({
      deviceName: 'TV',
      command: 'POWER',
      value: 'ON',
    });
    //this.deviceController.sendDeviceCommand(this.displayName, 'POWER', 'ON');
    //this.status = 'on';
    clearTimeout(this.displayOffTimer);
  }
  off(delay) {

    if (delay == undefined) {
      delay = this.offDelay
    }
    else if (delay == 0) {
      delay = 1
    }

    clearTimeout(this.displayOffTimer);
    var that = this;
    this.displayOffTimer = setTimeout(function () {
      if (that.debug)
        console.log(`[${that.instanceName}] ${that.displayName}_POWER_OFF`);
      that.deviceDriver.sendCommand({
        deviceName: 'TV',
        command: 'POWER',
        value: 'OFF',
      });
      //that.deviceController.sendDeviceCommand(that.displayName, 'POWER', 'OFF');
    }, delay);

    //this.status = 'off';
  }
  source(src) {

  }
  displayFeedback(feedback) {
    if (feedback.status) {
      this.status = feedback.status;
      console.log(`${this.instanceName} STATUS changed to ${this.status}`);
    }
  }
  getStatus() {
    return this.status;
  }
}

export class screen extends yapi.Module {
  constructor(instanceName, config) {
    super(instanceName);
    this.name = 'screen';
    this.description = 'Motorized screen controller';
    this.functionalities = [yapi.functionalities.DISPLAY.SCREEN];
    this.screenOffTimer = undefined;
    this.screenName = config.name;
    this.screenUpDelay = config.screenUpDelay;
    this.position = config.position;
    this.debug = config.debug;
    this.deviceControllerInstanceName = config.deviceControllerInstanceName;
    return this.name;
  }
  init() {
    this.deviceController = yapi.modules.getModuleByInstanceName(this.deviceControllerInstanceName);

    if (this.position == 'up') {
      this.up(0);
    }
    else {
      this.down();
    }
  }
  down() {
    if (this.debug)
      console.log(`[${this.instanceName}] ${this.screenName}_DOWN`)
    this.deviceController.sendDeviceCommand(this.screenName, 'DOWN');
    this.position = 'down';
    clearTimeout(this.screenOffTimer);
  }
  up(delay) {

    if (delay == undefined) {
      delay = this.screenUpDelay
    }
    else if (delay == 0) {
      delay = 1
    }

    clearTimeout(this.screenUpTimer);
    var that = this;
    this.screenUpTimer = setTimeout(function () {
      if (that.debug)
        console.log(`[${that.instanceName}] ${that.screenName}_UP`)
      that.deviceController.sendDeviceCommand(that.screenName, 'UP');
    }, delay);

    this.position = 'up';
  }

  getPosition() {
    return this.position;
  }
}
