import xapi from 'xapi';

const pcOut1 = 3;
const pcOut2 = 4;
const laptop = 5;

async function enableWeirdMode() {
  xapi.Command.Call.Disconnect();
  xapi.Command.Presentation.Stop();

  xapi.Config.UserInterface.Features.Call.Start.set('Hidden');
  xapi.Config.UserInterface.Features.Call.JoinWebex.set('Hidden');
  xapi.Config.UserInterface.Features.Call.JoinZoom.set('Hidden');
  xapi.Config.UserInterface.Features.Share.Start.set('Hidden');


  xapi.Config.Video.Input.Connector[pcOut1].Visibility.set('Never');
  xapi.Config.Video.Input.Connector[pcOut2].Visibility.set('Never');

  xapi.Config.Video.Input.Connector[laptop].PresentationSelection.set('Manual');
  xapi.Config.Video.Input.Connector[laptop].Visibility.set('Never');


  xapi.Command.Cameras.PresenterTrack.Set({ Mode: 'Follow' });

  xapi.Config.Audio.Input.HDMI[pcOut1].VideoAssociation.MuteOnInactiveVideo.set('Off');
  xapi.Config.Audio.Input.HDMI[pcOut2].VideoAssociation.MuteOnInactiveVideo.set('Off');

  xapi.Command.Video.Matrix.Reset();
  xapi.Command.Video.Matrix.Assign({
    Mode: 'Replace',
    Output: 2,
    SourceId: 1
  });
  xapi.Command.Video.Matrix.Assign({
    Mode: 'Replace',
    Output: 1,
    SourceId: pcOut1
  });
  xapi.Command.Video.Matrix.Assign({
    Mode: 'Replace',
    Output: 3,
    SourceId: pcOut2
  });

}

async function disableWeirdMode() {
  xapi.Command.Call.Disconnect();
  xapi.Command.Presentation.Stop();

  xapi.Config.UserInterface.Features.Call.Start.set('Auto');
  xapi.Config.UserInterface.Features.Call.JoinWebex.set('Auto');
  xapi.Config.UserInterface.Features.Call.JoinZoom.set('Auto');
  xapi.Config.UserInterface.Features.Share.Start.set('Auto');


  xapi.Config.Video.Input.Connector[pcOut1].Visibility.set('IfSignal');
  xapi.Config.Video.Input.Connector[pcOut2].Visibility.set('IfSignal');

  xapi.Config.Video.Input.Connector[laptop].PresentationSelection.set('AutoShare');
  xapi.Config.Video.Input.Connector[laptop].Visibility.set('IfSignal');


  xapi.Config.Audio.Input.HDMI[pcOut1].VideoAssociation.MuteOnInactiveVideo.set('On');
  xapi.Config.Audio.Input.HDMI[pcOut2].VideoAssociation.MuteOnInactiveVideo.set('On');

  xapi.Command.Video.Matrix.Reset();

}



//enableWeirdMode();
disableWeirdMode();