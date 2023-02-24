import xapi from 'xapi';

async function getinfos() {
  let webexStatus = await xapi.Status.Webex.Status.get();
  let temperature = await xapi.Status.SystemUnit.Hardware.Monitoring.Temperature.Status.get();
  let macrosdiag = await xapi.Status.Diagnostics.Message[1].References.get();
  let uptime = await xapi.Status.SystemUnit.Uptime.get();
  let upgradeStatus = await xapi.Status.Provisioning.Software.UpgradeStatus.Status.get();
  console.log(macrosdiag);
}



var x = getinfos();
