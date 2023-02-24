import xapi from 'xapi';

export var functionalities = {
  CONTROLSYSTEM: {
    COMMUNICATION: 'CONTROLSYSTEM.COMMUNICATION',
  },
  DISPLAY: {
    MANAGER: 'DISPLAY.MANAGER',
    CONTROLLER: 'DISPLAY.CONTROLLER',
    COMMUNICATION:'DISPLAY.COMMUNICATION',
    MONITOR: 'DISPLAY.MONITOR',
    PROJECTOR: 'DISPLAY.PROJECTOR',
    SCREEN: 'DISPLAY.SCREEN',
    OTHER: 'DISPLAY.OTHER',
  },
  LIGHTS: {
    CONTROLLER: 'LIGHTS.CONTROLLER',
    ZONE: 'LIGHTS.ZONE',
    SCENE: 'LIGHTS.SCENE',
    UNIT: 'LIGHTS.UNIT'
  },
  SYSTEM: {
    NOTIFICATION: 'SYSTEM.NOTIFICATION',
    CONTROLLER: 'SYSTEM.CONTROLLER',
    CONSOLE: 'SYSTEM.CONSOLE',
    OTHER: 'SYSTEM.OTHER'
  },
  AUDIO: {
    CONTROLLER: 'AUDIO.CONTROLLER'
  }

}

export class Activity {
  constructor() {
  }
}

export class Module {
  constructor(instanceName) {
    this.instanceName = instanceName;
  }
}

export class Event {
  constructor(source, eventType, eventPayload) {
    this.source = source;
    this.type = eventType;
    this.payload = eventPayload;
  }
}

export var Events = {
  controller: {
    initDone: class extends Event { constructor(done) { super('CONTROLLER', 'INITDONE', { done }) } }
  },
  system: {
    activitiesLoaded: class extends Event { constructor() { super('ACTIVITIES', 'LOADED'), { loaded:true } } },
    modulesLoaded: class extends Event { constructor() { super('MODULES', 'LOADED'), { loaded:true } }  }
  },
  activity: {
    enabled: class extends Event { constructor(name) { super('ACTIVITY', 'ENABLED', { name: name }); } },
    disabled: class extends Event { constructor(name) { super('ACTIVITY', 'DISABLED', { name: name }); } },

  }
}

export class Yapi  {
  constructor(systemCheck, communication, modules, activities) {
    module.exports.systemCheck = systemCheck;
    module.exports.communication = communication;
    module.exports.modules = modules;
    module.exports.activities = activities;
  }
}