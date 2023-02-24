import xapi from 'xapi';
import * as yapi from './yapi';

const DEFAULT_TOAST_DURATION = 5000;

export class toasts extends yapi.Module {
  constructor(instanceName, config) {
    super(instanceName);
    this.name = 'toasts';
    this.description = 'Ordered Android toasts equivalent';
    this.functionalities = yapi.functionalities.SYSTEM.NOTIFICATION;
    this.source = config.source;
    this.displaying = false;

    this.toastsList = [];

    return this.name;
  }
  init() {

  }
  display(tTitle, tText, tTime) {
    this.toastsList.push({ title: tTitle, text: tText, time: tTime });
    if (!this.displaying) {
      this.displaying = true;
      this.displayNext();
    }
  }
  
  displayNext() {
    var time = DEFAULT_TOAST_DURATION;
    if (this.toastsList.length > 0) {
      var currentToast = this.toastsList.shift();
      if (currentToast.time) {
        time = currentToast.time;
      }
      xapi.Command.UserInterface.Message.Alert.Display({
        Text: currentToast.text,
        Title: currentToast.title
      });
      var that = this;
      setTimeout(function () {
        xapi.Command.UserInterface.Message.Alert.Clear();
        if (that.toastsList.length > 0) {
          that.displayNext();
        }
      }, time);
    }
    else {
      this.displaying = false;
    }
  }
}