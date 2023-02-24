/*jshint esversion: 6 */
//VERSION:4.2
const xapi = require('xapi');



/* SCRIPT INIT */
async function init() {
  var bootTime = await getBootTime();
  if (bootTime > 290) {
    /* endSession panel override */
    xapi.command('UserInterface Extensions Panel Save', {
      PanelId: 'endSessionUsbModeDual'

    }, `
  <Extensions>
  <Version>1.8</Version>
  <Panel>
    <Order>${RoomConfig.config.ui.iconOrder.shutdown}</Order>
    <PanelId>endSession</PanelId>
    <Type>Home</Type>
    <Icon>Power</Icon>
    <Color>#FF0000</Color>
    <Name>Fermer le système</Name>
    <ActivityType>Custom</ActivityType>
  </Panel>
</Extensions>
`);

    xapi.Command.UserInterface.Extensions.Panel.Update({ PanelId: 'endSessionUsbModeDual', Visibility: 'Hidden' });

    /* INTER-MACRO COMMUNICATION */
    usbmode_enabled = Rkhelper.IMC.getFunctionCall('usbmode_enabled');
    usbmode_disabled = Rkhelper.IMC.getFunctionCall('usbmode_disabled');
    forceNotifyStatusChange = Rkhelper.IMC.getFunctionCall('forceNotifyStatusChange');
    disableCustomScenario = Rkhelper.IMC.getFunctionCall('disableCustomScenario');
    controllerStandbyRequest = Rkhelper.IMC.getFunctionCall('controllerStandbyRequest');

    Rkhelper.IMC.registerFunction(privatemode_enabled);
    Rkhelper.IMC.registerFunction(privatemode_disabled);


    Rkhelper.Audio.getLocalInputId('PC').then(input => {
      pcAudioInputId = input;
      Rkhelper.Audio.getLocalInputId('Microphone').then(input => {
        micAudioInputId = input;
        Rkhelper.Audio.getLocalOutputId('USB').then(output => {
          usbAudioOutputId = output;
        });
      });
    });

    xapi.Event.UserInterface.Extensions.Panel.Clicked.on(event => {
      if (event.PanelId == PANELID) {
        if (usbModeDualEnabled) {
          disableUsbModeDual();
        }
        else {
          xapi.Command.UserInterface.Message.Prompt.Display({
            Duration: 30,
            FeedbackId: 'enableusbmodedual',
            Text: 'Activation en cours, un instant s.v.p...',
            Title: 'Comodal écrans étendus'
          });
          projOn();
          setTimeout(function () {
            enableUsbModeDual();
            setTimeout(function () {
              forceNotifyStatusChange();
            }, 25000);
          }, 15000);
        }
      }
      if (event.PanelId == 'endSessionUsbModeDual') {
        if (usbModeDualEnabled) {
          Rkhelper.UI.prompt.display({
            Duration: 8,
            Title: `Fin de session`,
            Text: `Votre session se terminera et tous les paramètres du système seront réinitialisés.<br>Voulez-vous continuer ?`,
            Options: [
              {
                id: 'endSessionContinue',
                label: 'Oui, fermer la session',
                callback: function () {
                  disableUsbModeDual();
                  setTimeout(function () {
                    xapi.Command.Presentation.Stop();
                    xapi.Command.Call.Disconnect();
                    xapi.Command.UserInterface.Message.Prompt.Display(
                      {
                        Duration: 6,
                        FeedbackId: 'standbymessage',
                        Text: 'Aurevoir, à la prochaine!',
                        Title: `Fermeture de la session...`
                      });
                    setTimeout(function () {
                      xapi.Command.Standby.Activate();
                    }, 6000);
                  }, 8000);
                }
              },
              {
                id: 'endSessionCancel',
                label: 'Non, annuler',
                callback: function () { }
              }
            ]
          },
            cancel => {

            });

        }
      }
    });
  }
}



/* RESPOND TO SLEEP / RESET */
xapi.Status.Standby.State.on(state => {
  if (state == 'Standby') {
    //disableUsbModeDual();
  }
  else if (state == 'Off') {
    createUi();
  }
  else if (state == 'Halfwake') {
    //code ici
  }
});

/* USER INTERFACE */
function createUi() {


  xapi.Command.UserInterface.Extensions.Panel.Save({
    PanelId: 'p_usbmodedual'
  },
    `
<Extensions>
  <Version>1.8</Version>
  <Panel>
    <Order>1</Order>
    <PanelId>p_usbmodedual</PanelId>
    <Origin>local</Origin>
    <Type>Home</Type>
    <Icon>Custom</Icon>
    <Color>#4287f5</Color>
    <Name>Activer Comodal écrans étendus (USB)</Name>
    <ActivityType>Custom</ActivityType>
    <CustomIcon>
      <Content>/Content>
      <Id>c543a9711d9368ecc9a0231f20c7fec9205cd38aef825686205648f7c98a6a4a</Id>
    </CustomIcon>
  </Panel>
</Extensions>
`);
}

async function getCurrentCameraConnector() {
  return await xapi.Status.Video.Input.MainVideoSource.get();
}


createUi();
setTimeout(init, 10000);