import xapi from 'xapi';
const modulesconfig = require('./modulesconfig');



var loadedModules = [];
var xapiEvents = [];


function loadModules() {
  for (var mod of modulesconfig.moduleslist) {
    var newMod = require(`./${mod.load}`);
    loadedModules.push({ module: newMod, name: mod.name });
  }

  for (var mod of loadedModules) {
    mod.module.modules = [];
    for (var m of loadedModules) {
      if (mod.name != m.name) {
        mod.module.modules[m.name] = m.module;
      }
    }
  }

  for (var mod of loadedModules) {
    if (mod.module.onReady) { mod.module.onReady(); }
  }
}


async function init() {
  loadModules();
}

init();






