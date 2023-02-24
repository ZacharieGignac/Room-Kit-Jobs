const system = require('./system');

const controller = new system.Controller();
/*
const uibuilder = require('./ui-builder');
const ui = require('./ui');

let uistruct = {
  type:'Config',
  children:[
    {
      type:'Panel',
      panelId:'id-test',
      name:'nom',
      children:[
        {
          type:'Page',
          pageId:'Page1',
          name:'PageName'
        }
      ]
    }
  ]
};

ui.panelSave('test',uibuilder.fromJsonObject(uistruct));
*/
