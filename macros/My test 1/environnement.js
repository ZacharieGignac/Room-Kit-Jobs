import xapi from 'xapi';


function updateEnv() {

  xapi.Status.RoomAnalytics.get().then(r => {

    xapi.Command.UserInterface.Extensions.Widget.SetValue({
      WidgetId: 'txttemperature',
      Value: r.AmbientTemperature + 'Â°c'
    });
    xapi.Command.UserInterface.Extensions.Widget.SetValue({
      WidgetId: 'txthumidity',
      Value: r.RelativeHumidity + '%'
    });
    xapi.Command.UserInterface.Extensions.Widget.SetValue({
      WidgetId: 'txttovc',
      Value: r.AirQuality.Index + ' mg/mÂ³'
    });

    let qualitytext = '';
    let quality = r.AirQuality.Index;

    if (quality <= 1.99) {
      qualitytext = 'Excellente ð';
    }
    else if (quality > 1.99 && quality <= 2.99) {
      qualitytext = 'Bonne ð';
    }
    else if (quality > 2.99 && quality <= 3.99) {
      qualitytext = 'Moyenne ð';
    }
    else if (quality > 3.99 && quality <= 4.99) {
      qualitytext = 'Faible ð';
    }
    else if (quality > 4.99) {
      qualitytext = 'Mauvaise ðµ';
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