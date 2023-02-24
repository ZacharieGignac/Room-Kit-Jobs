import xapi from 'xapi';




export var config = {
  systemName: 'PVE-DEV',
  systemVersion: '1.0',
  systemDescription: 'Dev system',
  systemCheckInterval: 30000,
  silentSystemCheck: true,

  activities: {
    defaultActivity: 'act_telepresence'
  },

  room: {
    controllableLights: true,
    motorizedScreens: true,
    presenterDeskLocation: 'right'
  }

}


export var activitiesList = [
  {
    lib: 'act_telepresence',
    activity: 'telepresence',
    hidden: false,
    config: {
      lightsControlModule: 'mod_yapilights'
    }
  },
  {
    lib: 'act_manual',
    activity: 'manual',
    hidden: false,
    config: {
      lightsControlModule: 'mod_yapilights'
    }
  }
]

export var modulesList = [
  {
    lib: 'mod_globalcache',
    module: 'flex232',
    instanceName: 'flex232.display.remotesites',
    config: {
      ip: '1.1.1.1'
    }
  },
  {
    lib: 'mod_globalcache',
    module: 'flex232',
    instanceName: 'flex232.display.presentation',
    config: {
      ip: '2.2.2.2'
    }
  },
  {
    lib: 'mod_audio',
    module: 'utils',
    config: {
      inputs: [
        {
          name: 'Sans-fil (casque)',            //Nom de l'entrée audio
          connector: 6,                         //Numéro de connecteur
          normal: 54,                           //Volume normal en DB
          loud: 57,
          louder: 60,
          defaultMode: 'normal'                 //Mode par défaut (mute, normal, loud, louder)
        },
        {
          name: 'Bâton',                        //Nom de l'entrée audio
          connector: 8,                         //Numéro de connecteur
          normal: 57,                           //Volume normal en DB
          loud: 57,
          louder: 60,
          defaultMode: 'normal'                 //Mode par défaut (mute, normal, loud, louder)
        },
        {
          name: 'XLR haut (plaque)',            //Nom de l'entrée audio
          connector: 7,                         //Numéro de connecteur
          normal: 54,                           //Volume normal en DB
          loud: 57,
          louder: 60,
          defaultMode: 'normal'                 //Mode par défaut (mute, normal, loud, louder)
        },
        {
          name: 'XLR bas (plaque)',             //Nom de l'entrée audio
          connector: 5,                         //Numéro de connecteur
          normal: 54,                           //Volume normal en DB
          loud: 57,
          louder: 60,
          defaultMode: 'normal'                 //Mode par défaut (mute, normal, loud, louder)
        }
      ]
    }
  },
  {
    lib: 'mod_crestron',
    module: 'communication',
    instanceName: 'roomcontroller',
    config: { ip: '10.10.48.10', serial: 'SN564374823' }
  },
  {
    lib: 'mod_notifications',
    module: 'toasts'
  },
  {
    lib: 'mod_activityselector',
    module: 'manualselector'
  },
  {
    lib: 'mod_displaycontroller',
    module: 'display',
    instanceName: 'display.remotesites',
    config: {
      name: 'TV',
      offDelay: 30000,
      defaultStatus: 'off',
      deviceControllerInstanceName: 'flex232.display.remotesites',
      deviceDriver: {
        lib: 'drv_dummydisplays',
        driver: 'dummytv'
      },
      debug: true
    }
  },
  {
    lib: 'mod_displaycontroller',
    module: 'display',
    instanceName: 'display.presentation',
    config: {
      name: 'PROJECTOR',
      offDelay: 30000,
      defaultStatus: 'off',
      deviceControllerInstanceName: 'flex232.display.presentation',
      deviceDriver: {
        lib: 'drv_dummydisplays',
        driver: 'dummytv'
      },
      debug: true
    }
  }
]

