import xapi from 'xapi';

const BUTTONNAME = 'sharehdmi4'; //the ID of your button
const CONNECTOR = 4; //what connector you want to share
const SENDINGMODE = 'LocalRemote'; //You can change to LocalOnly for preview without sharing

xapi.Event.UserInterface.Extensions.Panel.Clicked.on(event => {
  if (event.PanelId == BUTTONNAME) {
    xapi.Command.Presentation.Start({
      ConnectorId:CONNECTOR,
      SendingMode:SENDINGMODE
    });
  }
});