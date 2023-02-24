import xapi from 'xapi';

const NONE = 'none';
const LUTRIN = 'lutrin';
const PRESIDENCE = 'presidence';
const REMOTE = 'remote';

function init() {

  xapi.Command.UserInterface.Presentation.ExternalSource.RemoveAll();

  xapi.Command.UserInterface.Presentation.ExternalSource.Add({
    ConnectorId: 4,
    Name: "Présidence",
    SourceIdentifier: "presidence",
    Type: "PC"
  });
  xapi.Command.UserInterface.Presentation.ExternalSource.Add({
    ConnectorId: 4,
    Name: "Lutrin",
    SourceIdentifier: "lutrin",
    Type: "PC"
  });
  xapi.Command.UserInterface.Presentation.ExternalSource.State.Set({ SourceIdentifier: 'presidence', State: 'Ready' });
  xapi.Command.UserInterface.Presentation.ExternalSource.State.Set({ SourceIdentifier: 'lutrin', State: 'Ready' });

  xapi.Event.UserInterface.Presentation.ExternalSource.on(value => {
    setActivePresentation(value.Selected.SourceIdentifier);
  });
  xapi.Event.PresentationStopped.on(presentationStopped);
  xapi.Event.PresentationPreviewStopped.on(presentationStopped);
  xapi.Event.PresentationStarted.on(presentationStarted);
  xapi.Event.PresentationStarted.on(presentationStarted);
}
function presentationStopped(pres) {
  setActivePresentation(NONE);
}
function presentationStarted(pres) {
  setActivePresentation(NONE);
}

function pressButton(buttonId) {
  xapi.Command.UserInterface.Extensions.Widget.Action({ Type: 'clicked', Value: '', WidgetId: buttonId });
}
function setActivePresentation(pres) {
  console.log(`Active presentation is: ${pres}`);
  switch (pres) {
    case NONE:
      pressButton('presentation_aucune-1');
      break;
    case LUTRIN:
      pressButton('presentation_lutrin-1');
      break;
    case PRESIDENCE:
      pressButton('presentation_presidence-1');
      break;
    case REMOTE:
      break;
  }
}
init();