import xapi from 'xapi';

function getElectricalDemand() {
  xapi.Command.HttpClient.Get(
    { 
      AllowInsecureHTTPS: true, 
      Timeout: 10, 
      Url: 'https://www.hydroquebec.com/data/documents-donnees/donnees-ouvertes/json/demande.json'
    }).then(result => {
      var demandData = JSON.parse(result.Body);
      var latestDemandData = demandData.details[demandData.indexDonneePlusRecent];
      var demandTotal = latestDemandData.valeurs.demandeTotal;
      
      xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId:'txtdemand', Value:demandTotal + ' megawatts'});
      xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId:'txthydroupdate', Value:new Date().toTimeString()});
    });
}
getElectricalDemand();
setInterval(getElectricalDemand,900000);