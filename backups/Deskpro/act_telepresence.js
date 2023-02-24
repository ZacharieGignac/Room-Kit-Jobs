import xapi from 'xapi';
import * as yapi from './yapi';
const ui = require('./ui');
const builder = require('./ui-builder');

const NORMAL_NAME = 'act_telepresence';
const NORMAL_DESCRIPTION = 'Telepresence Activity (SIP call or conference (Webex, Zoom, etc...)';
const STANDBY_NAME = 'act_standby';
const STANDBY_DESCRIPTION = 'Standby behavior';

const shutdownPanel =
{
  panelId: 'endSessionNormal',
  type: 'home',
  xml: `
  <Extensions>
  <Version>1.8</Version>
  <Panel>
    <Order>1</Order>
    <PanelId>endSessionNormal</PanelId>
    <Type>Home</Type>
    <Icon>Power</Icon>
    <Color>#FF0000</Color>
    <Name>Fermer le système</Name>
    <ActivityType>Custom</ActivityType>
  </Panel>
</Extensions>
`
}






export class telepresence extends yapi.Activity {
  constructor(config) {
    super();
    this.name = NORMAL_NAME;
    this.friendlyName = 'Téléprésence';
    this.description = NORMAL_DESCRIPTION;
    this.customPanels = true;
    this.broadcastReceiver = this.broadcastReceived;
    this.eventReceiver = this.eventReceived;
    this.updateUi = this.uiUpdated;
    this.panelList = ['endSessionNormal', 'activity_selector'];
    return this.name;
  }
  createPanel() {
    /*
    const audio = yapi.modules.getModuleByInstanceName('mod_audio.utils');

    const { Config, Panel, Page, Row, Slide, Button } = builder;
    let page = Page({ pageId: 'widgets', name: 'Just a test' });
    let micControls = audio.getMicrophonesControls();
    
    micControls.forEach(row => {
      page.children.push(row);
    });

    const config = Config({ version: '1.7' },
      Panel({ panelId: 'act_normal_panel', color: '#FF0000', name: 'act_normal panel', icon: 'Blinds', order: -1 }, [
        page
      ]));
      
    ui.panelSave('act_normal_panel', config);
    */
  }
  init() {
    this.activitySelector = yapi.modules.getModuleByInstanceName('mod_activityselector.manualselector');
    this.projector = yapi.modules.getModuleByInstanceName('display.presentation');
    this.monitor = yapi.modules.getModuleByInstanceName('display.remotesites');
    this.audioutils = yapi.modules.getModuleByInstanceName('mod_audio.utils');
  

  }
  enable() {
    //console.log(`Projector status: ${this.projector.getStatus()}`);
    var mods = yapi.modules.getModulesByFunctionality(yapi.functionalities.DISPLAY.CONTROLLER);
    mods.forEach(dc => {
      console.log(`Display controller found: ${dc.instanceName}`);
    });
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
  disable() {
    return new Promise((resolve, reject) => {
      this._enable();
      resolve();
    });
  }
  broadcastReceived(message) {

  }
  eventReceived(event) {
    if (event.source == 'MODULES' && event.type == 'LOADED') {
      console.log('All modules loaded!!');
    }
  }
  getPanels() {
    return [shutdownPanel, this.activitySelector.getActivitiesPanel()];
  }
  uiUpdated() {
    //console.log('Updated');
  }
}

export class act_standby extends yapi.Activity {
  constructor(config) {
    super();
    this.name = STANDBY_NAME;
    this.description = STANDBY_DESCRIPTION;
    this.customPanels = false;
    return this.name;
  }
  init() {

  }
  enable() {

    return new Promise((resolve, reject) => {
      resolve();
    });
  }
  disable() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
  updateUi() {
    console.log('UI has been updated!');
  }
}
