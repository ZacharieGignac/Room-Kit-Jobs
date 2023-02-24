import xapi from 'xapi';
import * as yapi from './yapi';
const builder = require('./ui-builder');
const ui = require('./ui');



export var base = 'activityselector';

export class manualselector extends yapi.Module {
  constructor(instanceName, config) {
    super(instanceName);
    this.name = 'manualselector';
    this.description = 'A manual activity selector, with UI';
    this.functionalities = yapi.functionalities.SYSTEM.CONTROLLER;
    return this.name;
  }
  init() {
    this.activities = yapi.activities.loadedActivities;
  }
  
  eventReceiver(event) {
    if (event.source == 'ACTIVITY' && event.type == 'ENABLED') {

      ui('sel_activity').setValue(event.payload.name);

    }
  }
  test() {
    console.log('Activity selector test');
  }
  getActivitiesPanel() {

    var controls = [];

    const { Config, Panel, Page, Row, GroupButton } = builder;
    let page = Page({ pageId: 'page_activity_selector', name: 'Choisir scénario' });

    let tempRow = Row({ text: `Choisir scénario` });

    let buttonlist = {};
    this.activities.forEach(act => {
      buttonlist[act.name] = act.friendlyName;
    });

    let tempButton = GroupButton({ widgetId: `sel_activity`, columns: 1, buttons: buttonlist });

    tempRow.children.push(tempButton);

    page.children.push(tempRow);


    const config = Config({ version: '1.7' },
      Panel({ panelId: 'activity_selector', color: '#000000', name: 'Choisir Scénario', icon: 'Sliders', order: 4 }, [
        page
      ]));


    ui('sel_activity').onGroupButtonPressed((activity) => {
      yapi.activities.changeActivity(activity);
    });

    var panel =
    {
      panelId: 'activity_selector',
      type: 'home',
      xml: config.toString()
    }



    return panel;


  }
}