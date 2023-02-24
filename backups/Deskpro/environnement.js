import xapi from 'xapi';


function updateEnv() {

  xapi.Status.RoomAnalytics.get().then(r => {

    xapi.Command.UserInterface.Extensions.Widget.SetValue({
      WidgetId: 'txttemperature',
      Value: r.AmbientTemperature + '°c'
    });
    xapi.Command.UserInterface.Extensions.Widget.SetValue({
      WidgetId: 'txthumidity',
      Value: r.RelativeHumidity + '%'
    });
    xapi.Command.UserInterface.Extensions.Widget.SetValue({
      WidgetId: 'txttovc',
      Value: r.AirQuality.Index + ' mg/m³'
    });

    let qualitytext = '';
    let quality = r.AirQuality.Index;

    if (quality <= 1.99) {
      qualitytext = 'Excellente 😃';
    }
    else if (quality > 1.99 && quality <= 2.99) {
      qualitytext = 'Bonne 🙂';
    }
    else if (quality > 2.99 && quality <= 3.99) {
      qualitytext = 'Moyenne 😕';
    }
    else if (quality > 3.99 && quality <= 4.99) {
      qualitytext = 'Faible 🙁';
    }
    else if (quality > 4.99) {
      qualitytext = 'Mauvaise 😵';
    }
    xapi.Command.UserInterface.Extensions.Widget.SetValue({
      WidgetId: 'txtairquality',
      Value: qualitytext
    });
  });
}

xapi.Event.UserInterface.Extensions.Panel.Clicked.on(p => {
  if (p.PanelId == 'env') {
    updateEnv();
  }
});

setTimeout(updateEnv,60000);