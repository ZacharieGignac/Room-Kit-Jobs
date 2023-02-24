import xapi from 'xapi';
import * as yapi from './yapi';
const ui = require('./ui');
const builder = require('./ui-builder');


export class utils extends yapi.Module {
  constructor(instanceName, config) {
    super(instanceName);
    this.name = 'Audio utils';
    this.description = 'Things to make audio controls easier';
    this.functionalities = [yapi.functionalities.AUDIO.CONTROLLER];
    this.updateUi = this.uiUpdated;

    this.inputs = config.inputs;
    this.initInputs();

    return this.name;
  }

  init() {

  }
  initInputs() {
    this.inputs.forEach(input => {
      input.currentMode = input.defaultMode;
    });
  }

  uiUpdated() {
    this.inputs.forEach(input => {


      xapi.Command.UserInterface.Extensions.Widget.SetValue({
        widgetId: `audio_input_${input.connector}`,
        value: input.currentMode
      }).catch(e => { });


      ui(`audio_input_${input.connector}`).onGroupButtonPressed((button) => this.uiChangeGain(input.connector, input[button]));
    });
  }

  uiChangeGain(input, gain) {
    console.log(input + ":" + gain);
    this.reset();
  }

  reset() {
    this.initInputs();
    this.uiUpdated();
  }

  getMicrophonesControls() {
    const { Row, GroupButton } = builder;
    var controls = [];

    this.inputs.forEach(input => {
      let tempRow = Row({ text: `${input.name}` });
      let tempButton = GroupButton({ widgetId: `audio_input_${input.connector}`, columns: 4, buttons: { mute: 'Muet', normal: 'Normal', loud: 'Plus fort', louder: 'Trop fort' } });
      tempRow.children.push(tempButton);
      controls.push(tempRow);
    });


    return controls;
  }

  displayInputStatus() {
    this.inputs.forEach(input => {
      console.log(input);
    });
  }
}

/*
  {
    type: 'GroupButton',
    options: { buttons: { first: 'Alt 1', second: 'Alt 2', third: 'Alt 3' }},
    info: 'To select btw presets',
  },
  */