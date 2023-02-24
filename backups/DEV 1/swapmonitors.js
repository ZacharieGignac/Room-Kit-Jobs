import xapi from 'xapi';

const SWAP_BUTTON_ID = 'swap';      //Create a button in the editor with this name, or change this name
const LEFT_MONITOR_CONNECTOR = 1;   //Output connector for your "left" monitor
const RIGHT_MONITOR_CONNECTOR = 2;  //Output connector for your "right" monitor

async function swapMonitors() {
  const currentLeftMonitor1Role = await xapi.Config.Video.Output.Connector[LEFT_MONITOR_CONNECTOR].MonitorRole.get(); //Gets the current monitor role for left monitor and saves it
  const currentRightMonitorRole = await xapi.Config.Video.Output.Connector[RIGHT_MONITOR_CONNECTOR].MonitorRole.get();  //Gets the current monitor role for right monitor and saves it
  xapi.Config.Video.Output.Connector[LEFT_MONITOR_CONNECTOR].MonitorRole.set(currentRightMonitorRole);  //Sets the left monitor role to the saved right monitor role
  xapi.Config.Video.Output.Connector[RIGHT_MONITOR_CONNECTOR].MonitorRole.set(currentLeftMonitor1Role); //Sets the right monitor role to the saved left monitor role
}

async function init() {
  //Listens to the UI widget event
  xapi.Event.UserInterface.Extensions.Widget.Action.on(action => {
    //if it's the right button
    console.log(action);
    if (action.WidgetId == SWAP_BUTTON_ID && action.Type == 'clicked') {
      //Swap the monitors
      swapMonitors();
    }
  });
}

init();

//YYYYYYYYYYEEEEEEEEEEEEEEAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHH, FRIDAYYYYYYYYY!!!!!!
