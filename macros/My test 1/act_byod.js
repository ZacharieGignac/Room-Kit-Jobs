import xapi from 'xapi';
import * as yapi from './yapi';

const NAME = 'ACT_BYOD';
const DESCRIPTION = 'BYOD Activity, without any telepresence';
const shutdownPanel =
{
  panelId: 'endSessionByod',
  type: 'home',
  xml: `
  <Extensions>
  <Version>1.8</Version>
  <Panel>
    <Order>1</Order>
    <PanelId>endSessionByod</PanelId>
    <Type>Home</Type>
    <Icon>Power</Icon>
    <Color>#0000FF</Color>
    <Name>Fermer le système</Name>
    <ActivityType>Custom</ActivityType>
  </Panel>
</Extensions>
`
}

export class act_byod extends yapi.Activity {
  constructor(config) {
    super();
    this.name = NAME;
    this.description = DESCRIPTION;
    this.broadcastReceiver = this.broadcastReceived;
    this.customPanels = true;

    return this.name;
  }
  init() {
    xapi.Status.Standby.State.on(value => {
      if (value == 'Standby') {
        this.controller.activities.changeActivity(this.name);
      }
    });
  }
  enable() {
    return new Promise((resolve, reject) => {
      var that = this;
      setTimeout(function () {
        that.controller.activities.changeActivity('ACT_NORMAL');
      }, 5000);
      resolve();
    });
  }
  disable() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
  broadcastReceived(message) {
    console.log('[ACT_BYOD] broadcastReceived: ' + message);
  }
  getPanels() {
    return [shutdownPanel];
  }
  updateUi() {

  }
  setup() {

  }
}