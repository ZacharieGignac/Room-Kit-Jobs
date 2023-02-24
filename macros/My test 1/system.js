import xapi from 'xapi';
import * as config from './config';
import * as storage from './storage'
import * as yapi from './yapi';
import * as ui from './ui';
import * as uibuilder from './ui-builder';


function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}


export class Communication {
  constructor(controller) {
    this.controller = controller;
    this.receivers = [];
    this.registeredFunctions = [];
  }
  broadcastMessage(message) {
    this.controller.activities.loadedActivities.forEach(s => {
      if (s.broadcastReceiver != undefined) {
        s.broadcastReceiver(message);
      }
    });
    this.controller.modules.loadedModules.forEach(m => {
      if (m.eventReceiver != undefined) {
        m.eventReceiver(event);
      }
    });
  }
  broadcastEvent(event) {
    if (event instanceof yapi.Event) {
      this.controller.activities.loadedActivities.forEach(s => {
        if (s.eventReceiver != undefined) {
          s.eventReceiver(event);
        }
      });
      this.controller.modules.loadedModules.forEach(m => {
        if (m.eventReceiver != undefined) {
          m.eventReceiver(event);
        }
      });
    }
    else {
      console.log(`[COMMUNICATION] Can't broadcast this event. Argument is not of type api.Event`);
    }
  }
  registerFunction(functionName, callback) {
    this.registeredFunctions.push({ functionName: functionName, callback: callback });
    console.log(`[COMMUNICATION: Registered function ${functionName}`);
  }
  callFunction(functionName, args) {
    this.registeredFunctions.forEach(f => {
      if (f.functionName == functionName) {
        f.callback(args);
      }
    });
  }
}

export class Activities {
  constructor(controller) {
    this.controller = controller;
    this.currentActivity = undefined;
    this.loadedActivities = [];


    this.controller.globals.vars('activities.changeRestricted').set(false);

    //Load activities
    console.log(`[ACTIVITIES] Checking ${config.activitiesList.length} activities...`);
    config.activitiesList.forEach(act => {

      var moduleRequire = require(`./${act.lib}`);
      var newact = new moduleRequire[act.activity](act.config);

      this.loadedActivities.push(newact);

      if (newact.customPanels) {
        this.unloadPanels(newact);
      }

      console.log(`[ACTIVITIES] Loaded: ${newact.name} (${newact.description})`);

    });


  }
  initActivities() {

    //Init activities
    this.loadedActivities.forEach(act => {
      act.init();
      console.log(`[ACTIVITIES] Init: ${act.name}`);
    });
  }
  test() {
    console.log(`TEST: Activitiess.test()`);
  }
  changeToDefaultActivity() {
    this.changeActivity(config.config.activities.defaultActivity, true).then(result => {
      console.log(`[ACTIVITIES] Changing to default activity ${result}`);
    });
  }
  changeActivity(name, force) {
    var changeRestricted = false;
    var force = false;

    return new Promise((resolve, reject) => {
      if (!this.controller.globals.vars('activities.changeRestricted').get() || (this.controller.globals.vars('activities.changeRestricted').get() && force)) {
        var newActivity = this.getActivityByName(name);
        console.log(`Requested activity: ${name}`);
        if (this.currentActivity != undefined) {
          if (this.currentActivity.name != name) {
            this.currentActivity.disable()
              .then(disableResult => {
                this.unloadPanels(this.currentActivity);
                this.controller.communication.broadcastEvent(new yapi.Events.activity.disabled(this.currentActivity.name));
                newActivity.enable()
                  .then(enableResult => {
                    this.currentActivity = newActivity;
                    if (this.currentActivity.customPanels) {
                      this.loadPanels(this.currentActivity);
                    }
                    console.log(`[ACTIVITIES] Changing to ${name}`);
                    this.controller.communication.broadcastEvent(new yapi.Events.activity.enabled(name));
                    resolve(name);
                  })
                  .catch(enableResult => {
                    reject(`[ACTIVITIES] ERROR: Can't enable activity: ${enableResult}`);
                  });
              })
              .catch(disableResult => {
                reject(`[ACTIVITIES] ERROR: Can't disable activity: ${disableResult}`);
              });
          }
          else {
            reject(`[ACTIVITIES] WARNING: Can't change activity: the requested activity is already active.`);
          }
        }
        else {
          newActivity.enable()
            .then(enableResult => {
              this.currentActivity = newActivity;
              if (this.currentActivity.customPanels) {
                this.loadPanels(this.currentActivity);
              }
              console.log(`[ACTIVITIES] Changing to ${name}`);
              this.controller.communication.broadcastEvent(new yapi.Events.activity.enabled(name));
              resolve(name);
            })
            .catch(enableResult => {
              reject(`[ACTIVITIES] ERROR: Can't disable activity: ${enableResult}`)
            });
        }
      }
      else {
        reject(`[ACTIVITIES] ERROR: Can't change activity. Activity change restriction is active.`);
      }
    });

  }
  loadPanels(act) {
    act.getPanels().forEach(panel => {
      try {
        console.log(`[ACTIVITIES] Loading panel "${panel.panelId}""`);
        xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: panel.panelId }, panel.xml);
      }
      catch { }
    });
  }
  unloadPanels(act) {
    act.panelList.forEach(panel => {
      try {
        console.log(`[ACTIVITIES] Removing panel "${panel}""`);
        xapi.Command.UserInterface.Extensions.Panel.Remove({ PanelId: panel });
      }
      catch { }
    });
  }
  restrictActivityChange(mode) {
    if (typeof (mode) == 'boolean') {
      console.log(`[ACTIVITIES] Activity change restriction: ${mode}`);
      this.controller.globals.vars.set('activities.changeRestricted').set(mode);
    }
  }

  getActivityByName(name) {
    var act = undefined;
    for (var i = 0; i < this.loadedActivities.length; i++) {
      if (this.loadedActivities[i].name == name) {
        act = this.loadedActivities[i];
      }
    }
    return act;
  }
  sendUpdateUiNotification() {
    if (this.currentActivity.updateUi != undefined) {
      this.currentActivity.updateUi();
    }
  }
}

/*

var modrequire = require(`./${modulesList[0].lib}`);
var obj = new modrequire['communication']();

*/

export class Modules {
  constructor(controller) {
    this.controller = controller;
    this.loadedModules = [];


    //Load modules
    console.log(`[MODULES] Checking ${config.modulesList.length} modules...`);
    config.modulesList.forEach(mod => {
      if (mod.createInstance == undefined || mod.createInstance == true) {
        if (!mod.config) {
          mod.config = {};
        }
        this.createInstance(mod, mod.instanceName, mod.config);
      }
    });
  }
  initModules() {
    this.loadedModules.forEach(mod => {
      mod.init();
      console.log(`[MODULES] Init: ${mod.name}`);
    });
  }
  createInstance(mod, instanceName, config) {

    if (config != undefined) {
      mod.config = config;
    }
    if (instanceName == '' || instanceName == undefined) {
      if (this.getModuleByInstanceName(`${mod.lib}.${mod.module}`)) {
        instanceName = `${mod.lib}.${mod.module}-${makeid(8)}`;
      }
      else {
        instanceName = `${mod.lib}.${mod.module}`;
      }
    }
    var moduleRequire = require(`./${mod.lib}`);
    var newinst = new moduleRequire[mod.module](instanceName, mod.config);

    this.loadedModules.push(newinst);
    console.log(`[MODULES] Created instance: ${newinst.name} [Instance Name: ${newinst.instanceName}] (${newinst.description}) -> ${newinst.functionalities}`);
    try {
      this.controller.communication.broadcastEvent(new yapi.Event('modules', 'createInstance', { instance: newinst }));
    }
    catch { }
    return newinst;


  }
  deleteInstance(instanceName) {
    for (var i = 0; i < this.loadedModules.length; i++) {
      if (this.loadedModules[i].instanceName == instanceName) {
        console.log(`[MODULES] Deleting instance "${instanceName}"`);
        this.loadedModules.splice(i, 1);
      }
    }
  }
  getModulesByName(name) {
    var modules = [];
    for (var i = 0; i < this.loadedModules.length; i++) {
      if (this.loadedModules[i].name == name) {
        modules.push(this.loadedModules[i]);
      }
    }
    return modules;
  }
  getModuleByType(type) {
    for (var i = 0; i < config.modulesList.length; i++) {
      if (`${config.modulesList[i].base.base}.${config.modulesList[i].module.name}` == type) {
        return config.modulesList[i];
      }
    }
    console.log(`[MODULES] getModuleByType: ${type} not found.`);
    return undefined;
  }
  getModulesByFunctionality(functionality) {
    var modules = [];
    for (var i = 0; i < this.loadedModules.length; i++) {
      if (this.loadedModules[i].functionalities.includes(functionality)) {
        modules.push(this.loadedModules[i]);
      }
    }
    return modules;
  }
  getModuleByInstanceName(name) {
    for (var i = 0; i < this.loadedModules.length; i++) {
      if (this.loadedModules[i].instanceName == name) {
        return this.loadedModules[i];
      }
    }
    return undefined;
  }
  sendUpdateUiNotification() {
    for (var i = 0; i < this.loadedModules.length; i++) {
      if (this.loadedModules[i].updateUi != undefined) {
        this.loadedModules[i].updateUi();
      }
    }
  }
  testModules() {
    console.log("TTTTTTTTTTTTTTTTTTTTEEEEEEEEEEEEEEEEEEEEEEEEEEESSSSSSSSSSSSSSSSSSSSSSSSSSSTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
  }

}

export class SystemCheck {
  constructor(controller) {
    var that = this;
    this.controller = controller;
    this.systemReady = false;
    this.systemReadyConditions = [];
    this.systemReadyInterval = setInterval(function () {
      that.checkSystemReadyConditions()
    }, config.config.systemCheckInterval);
  }
  addSystemReadyCondition(condition) {
    console.log('[SYSTEMCHECK] Adding System Ready Condition: ' + condition.name);
    this.systemReadyConditions.push(condition);
  }
  async checkSystemReadyConditions() {
    var failedMessages = [];
    for (var i = 0; i < this.systemReadyConditions.length; i++) {
      try {
        const x = await this.systemReadyConditions[i]();
      }
      catch (systemReadyError) {
        failedMessages.push(systemReadyError);
      }
    }
    if (failedMessages.length == 0) {
      if (!config.config.silentSystemCheck)
        console.log(`System Ready Check: READY`);
    }
    else {
      console.log(`System Ready Check: NOT READY: ${failedMessages}`);
      //xapi.Command.UserInterface.Message.Prompt.Display({ Duration: 6, Text: failed.toString().replace(',', '<br>'), Title: 'Système non prêt' });
    }

  }

}

export class Controller {
  constructor() {
    xapi.Command.UserInterface.Message.Prompt.Display({ Duration: 5, Text: 'Un instant svp', Title: 'Démarrage en cours' });

    console.log(`[CONTROLLER] Init...`);

    this.globals = new storage.Globals();
    this.globals.vars('config').set(config.config);


    this.globals.vars('system.ready').set(false);
    this.globals.vars('system.booting').set(true);



    this.systemCheck = new SystemCheck(this);


    /* SystemCheck conditions */
    /*
    const p1 = Promise((resolve, reject) => {
      setTimeout(() => {
        reject({ ready: true, reason: 'ca chie' });
      }, 1 * 1000);

    });
    const p2 = Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ ready: true, reason: 'ca me tente pas' });
      }, 1 * 2000);

    });
    */

    /*
    STANDARD SYSTEM CHECK TEMPLATES
    const firstCheck = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('Connexion au réseau impossible.');
        }, 3000);
      });
    }
    const secondCheck = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('Communication intérompue avec Crestron.');
        }, 1000);
      });
    }
        this.systemCheck.addSystemReadyCondition(firstCheck);
    this.systemCheck.addSystemReadyCondition(secondCheck);
    */





    this.communication = new Communication(this);
    this.modules = new Modules(this);
    this.activities = new Activities(this);

    this.yapi = new yapi.Yapi(this.systemCheck, this.communication, this.modules, this.activities);


    this.modules.initModules();
    //this.communication.broadcastEvent(new api.Events.system.modulesLoaded());


    this.activities.initActivities();



    //this.modules.createInstance(this.modules.getModuleByType('console.console'));
    //var monitor = this.modules.getModuleByInstanceName('display.remotesites');
    //var screen = this.modules.getModuleByInstanceName('display.screen');
    //console.log(`Current position of motorized screen: ${screen.getPosition()}`);
    //this.communication.registerFunction('myFunction', (msg) => { console.log('mooooooooooooooooooooooooooooo!!!!!!!!!!!!!!!!!!! ' + msg) });
    //this.communication.callFunction('myFunction', 'CA MARCHE!!!!!!!!!!!!!!!!!!!');

    //this.communication.broadcastEvent(new api.Event('controller', 'initdone', true));
    //this.communication.broadcastEvent(new api.Events.controller.initDone(true));

    /*
        var that = this;
        setTimeout(function () {
          that.activities.changeActivity('act_byod');
        }, 5000);
        */

    console.log(`Waiting 2 seconds for init completion...`)
    var that = this;
    setTimeout(function () {
      that.activities.changeToDefaultActivity();
      console.log(`[CONTROLLER] Init done`)


      /* handle for UI updates */
      xapi.Event.UserInterface.Extensions.Widget.LayoutUpdated.on(value => {
        that.modules.sendUpdateUiNotification();
        that.activities.sendUpdateUiNotification();
      });

      that.globals.vars('system.ready').onChange(() => {
        console.log('Activities: system.ready has changed!');
      });

      that.communication.broadcastEvent(new yapi.Events.system.activitiesLoaded());
      that.globals.vars('system.ready').set(true);
      that.globals.vars('system.booting').set(false);
      
    }, 2000);
  }

  get test() {
    return this._test;
  }
  set test(value) {
    this._test = value;
  }


  systemReady() {
    console.log('System is now ready');
  }
  systemNotReady() {
    console.log('System is NOT ready!');
  }



}




