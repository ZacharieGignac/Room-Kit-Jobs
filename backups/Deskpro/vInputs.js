import xapi from 'xapi';

function init() {

  xapi.Command.UserInterface.Presentation.ExternalSource.RemoveAll();
  /*
  xapi.Command.UserInterface.Presentation.ExternalSource.Add({
    ConnectorId: 2,
    Name: "Présidence",
    SourceIdentifier: "presidence",
    Type: "PC"
  });
  xapi.Command.UserInterface.Presentation.ExternalSource.Add({
    ConnectorId: 2,
    Name: "Présidence",
    SourceIdentifier: "lutrin",
    Type: "PC"
  });
  xapi.Command.UserInterface.Presentation.ExternalSource.State.Set({ SourceIdentifier: 'presidence', State: 'Ready' });
  xapi.Command.UserInterface.Presentation.ExternalSource.State.Set({ SourceIdentifier: 'lutrin', State: 'Ready' });

  xapi.Event.UserInterface.Extensions.Widget.Action.on(action => {
    console.log(action);
  });
  xapi.Command.UserInterface.Extensions.Widget.Action({ Type: 'clicked', Value: '', WidgetId: 'piton' });
  */
}
init();