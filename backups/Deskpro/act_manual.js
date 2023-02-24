import xapi from 'xapi';
import * as yapi from './yapi';

const panel_shutdown =
{
  panelId: 'endSessionNormal',
  type: 'home',
  xml: `
  <Extensions>
  <Version>1.8</Version>
  <Panel>
    <Order>-1</Order>
    <PanelId>endSessionNormal</PanelId>
    <Type>Home</Type>
    <Icon>Power</Icon>
    <Color>#FF0000</Color>
    <Name>Fermer le système</Name>
    <ActivityType>Custom</ActivityType>
  </Panel>
</Extensions>
`
};

const panel_display =
{
  panelId: 'act_manual_displays',
  type: 'home',
  xml: `
  <Extensions>
  <Version>1.8</Version>
  <Panel>
    <Order>-1</Order>
    <PanelId>act_manual_displays</PanelId>
    <Type>Home</Type>
    <Icon>video</Icon>
    <Color>#0000FF</Color>
    <Name>Paramètres d'affichage</Name>
    <ActivityType>Custom</ActivityType>
  </Panel>
</Extensions>
`
};
const panel_lights =
{
  panelId: 'act_manual_lights',
  type: 'home',
  xml: `
  <Extensions>
  <Version>1.8</Version>
  <Panel>
    <Order>-1</Order>
    <PanelId>act_manual_lights</PanelId>
    <Type>Home</Type>
    <Icon>Lightbulb</Icon>
    <Color>#00FFFF</Color>
    <Name>Paramètres d'éclairage</Name>
    <ActivityType>Custom</ActivityType>
  </Panel>
</Extensions>
`
};






export class manual extends yapi.Activity {
  constructor(config) {
    super();
    this.name = 'act_manual';
    this.friendlyName = 'Mode manuel'
    this.description = 'Mode pleinement manuel';
    this.customPanels = true;
    this.broadcastReceiver = this.broadcastReceived;
    this.eventReceiver = this.eventReceived;
    this.updateUi = this.uiUpdated;
    this.panelList = ['activity_selector','endSessionNormal', 'act_manual_displays', 'act_manual_lights', 'activity_selector'];
    
    return this.name;
  }

  init() {
    this.activitySelector = yapi.modules.getModuleByInstanceName('mod_activityselector.manualselector');

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
  broadcastReceived(message) {

  }
  eventReceived(event) {
    
  }
  getPanels() {
    return [this.activitySelector.getActivitiesPanel(),panel_display,panel_lights,panel_shutdown];
  }
  
  uiUpdated() {

  }
}