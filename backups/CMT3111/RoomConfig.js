//v5.0

import xapi from 'xapi';

export var config = {
  version: '7.0.0',
  ui: {
    iconOrder: { //Détermine l'ordre des icônes
      zoom: 1,
      usbmode: 2,
      settings: 3,
      shutdown: 4
    }
  },
  room: {
    name: 'CMT3111',                        //Nom du système, doit être unique
    displayControl: true,                   //Active le contrôle des affichages
    lightsControl: false,                    //Mode automatique de gestion de la salle <true, false>
    motorizedScreen: false,                  //Active le contrôle de la toile motorisée
    boardBehindScreen: false,                //Est-ce que le tableau est caché par l'écran motorise ? <true, false>
    tvOffDelay: 5000,                       //Temps avant la fermeture de la TV (MS)
    projOffDelay: 20000,                  //Temps avant la fermeture du projecteur (MS)
    loadingDelay: 5000,                     //Délais avant l'initialisation des scripts en ms. Défaut: 200000 (MS) (3 minutes 20 secondes)
    controlSystemPollingInterval: 5000,     //Temps entre chaque vérification du système de contrôle (Crestron)
    fakeControlSystem: false,                //false = normal, true = developement
    controlSystemSerial: '2124JBH00740',     //numéro de série du processeur crestron
    controlSystemSyncReboot:true,
    controlSystemRebootCommand:'SYSTEM_CRESTRON_REBOOT',
    showActivities: true,                    //Affiche la liste des activités
    showLightsIcon:false,
    defaultActivity: 'normal',               //Activité par défaut (normal par défaut)
    defaultPresenterLocation: 'local',       //Emplacement par défaut du présentateur (local, remote, none)
    autoEnablePresenterTrack: true,          //Active automatiquement le PresenterTrack lorsque possible et utile
    presenterTrackWarningDisplay:true,
    remotePresenterPIPPosition: 'UpperLeft',//Emplacement du PIP quand présentateur distant <CenterLeft, CenterRight, LowerLeft, LowerRight, UpperCenter, UpperLeft, UpperRight>
    callFeatures: 'Auto',
    useRoomPreset: true,
    activities: [                            //Activités. L'activité "normal" DOIT être présente même si elle n'est pas affichée
      {
        id: 'normal',                        //id de l'activité
        name: 'Normal'                       //Nom courant de l'activité
      },
      {
        id: 'writeonboard',                  //id de l'activité
        name: 'Écrire au tableau'            //Nom courant de l'activité
      }
    ]
  },
  usbmode: {
    localPcInput1: 4,                          //Entrée 1 pc local
    localPcInput2: 3                           //Entrée 2 pc local
  },
  zoom: {
    callHistoryAutoDelete: true,              //Effacement automatique du call history
    callHistoryAutoDeleteMethod: 'AUTODELETEMETHOD_ONDISCONNECT', //AUTODELETEMETHOD_ONDISCONNECT ou AUTODELETEMETHOD_ONSTANDBY
    callHistoryAutoDeleteTimeout: 30000       //Délais avant l'effacement du call history
  },
  camera: {
    connector: 6,
    defaultBrightness: 20                    //Brightness par défaut de la caméra
  },
  dnd: {
    strict: true,                            //Force le mode "Do Not Disturb" avec période de grâce
    offTime: 10,                               //Temps avant que le DND se réactive (minutes)
  },
  video: {
    remoteMonitorOutputId: 3,                 //Connecteur HDMI du moniteur des sites distants
    projectorOutputId: 1,                     //Connecteur HDMI du projecteur
    usbOutputId: 2,                           //Connecteur HDMI du convertisseur HDMI->USB
    autoShareInputs: [2]                       //Inputs qui sont en autoshare
  },
  audio: {
    roomMics:[1,2,3,4,5],
    loud: 6,                                  //Nombre de DB à additionner pour le mode "Fort"
    louder: 12,                                //Nombre de DB à additionner pour le mode "Très fort"
    inputs: [
      {
        name: 'Micro sans-fil',        //Nom de l'entrée audio
        connector: 6,                         //Numéro de connecteur
        normal: 57,                           //Volume normal en DB
        defaultMode: 'normal'                 //Mode par défaut (mute, normal, loud, louder)
      },
      {
        name: 'Micro bâton',        //Nom de l'entrée audio
        connector: 8,                         //Numéro de connecteur
        normal: 61,                           //Volume normal en DB
        defaultMode: 'normal'                 //Mode par défaut (mute, normal, loud, louder)
      },
      {
        name: 'Micro bâton 2',
        connector: 7,
        normal: 61,
        defaultMode: 'normal'
      }
    ],
    maxVolume: 100,                            //Volume maximal du système <0 - 100>
    defaultVolume: 60                          //Volume par défaut <0 - 100>
  },
  extrasauce: {
    presenterMics: [
      {
        connector: 6,
        gains: [
          {
            gain: 64,
            silence: 20
          },
          {
            gain: 70,
            silence: 25
          },
          {
            gain: 'default',
            silence: 20
          }
        ]
      },
      {
        connector: 7,
        gains: [
          {
            gain: 61,
            silence: 18
          },
          {
            gain: 67,
            silence: 25
          },
          {
            gain:70,
            silence:30
          },
          {
            gain: 'default',
            silence: 25
          }
        ]
      },
      {
        connector: 8,
        gains: [
          {
            gain: 61,
            silence: 18
          },
          {
            gain: 67,
            silence: 25
          },
          {
            gain:70,
            silence:30
          },
          {
            gain: 'default',
            silence: 25
          }
        ]
      }
    ],

    roomMics: [
      {
        connector: 1,
        gain: 51
      },
      {
        connector: 2,
        gain: 51
      },
      {
        connector: 3,
        gain: 51
      },
      {
        connector: 4,
        gain: 51
      },
      {
        connector: 5,
        gain: 51
      }
    ],
    roomMicsBoost: 10
  },
  scenarios: {
    autoScenarioChange: true,                  //TODO: ENLEVER
    displayPanel: false,                       //TODO: Affiche un panel de sélection de scénario. <true, false>. Défaut: false
  },
  lights: {                                    //Configuration de l'éclairage
    zones: [
      {
        name: 'Tableau',                         //Nom affiché dans l'interface graphique
        id: 'lights_zone2',                    //ID interne envoyé au contrôleur de lumières
        show: true,                            //Affichages des controles de lumières dans l'onglet "Éclairage"
        type: 'dim',                           //Type d'éclairage <dim, onoff>
        state: 'on',                           //État par défaut (on, off)
        level: 100,                            //Niveau par défaut <0 - 100>
        steps: 10                              //Pourcentage d'incrémentation

      },
      {
        name: 'Étudiants',
        id: 'lights_zone1',
        show: true,
        type: 'dim',
        state: 'on',
        level: 100,
        steps: 10
      },
      {
        name: 'Console',
        id: 'lights_zone3',
        show: true,
        type: 'dim',
        state: 'off',
        level: 0,
        steps: 10
      }
    ],
    scenes: [                                    //Configuration des scènes d'éclairage
      {
        name: 'Normal',                          //Nom courant de la scène
        id: 'scene_normal',                      //id de la scène
        show: true,                              //Affichage du bouton <true, false>
        presets: [                               //Liste des affichages à modifier
          {
            zone: 'lights_zone1',                //id de la zone à modifier
            state: 'on',                         //État de la zone
            level: 100                           //Niveau de la zone
          },
          {
            zone: 'lights_zone2',
            state: 'on',
            level: 100
          },
          {
            zone: 'lights_zone3',
            state: 'on',
            level: 100
          }
        ]
      },
      {
        name: 'Projection',
        id: 'scene_projection',
        show: true,
        presets: [
          {
            zone: 'lights_zone1',
            state: 'on',
            level: 75
          },
          {
            zone: 'lights_zone2',
            state: 'on',
            level: 50
          },
          {
            zone: 'lights_zone3',
            state: 'on',
            level: 80
          }
        ]
      },
      {
        name: 'Écriture tableau',
        id: 'scene_board',
        show: true,
        presets: [
          {
            zone: 'lights_zone1',
            state: 'on',
            level: 100
          },
          {
            zone: 'lights_zone2',
            state: 'on',
            level: 100
          },
          {
            zone: 'lights_zone3',
            state: 'on',
            level: 100
          }
        ]
      },
      {
        name: 'Obscurité',
        id: 'scene_blackout',
        show: true,
        presets: [
          {
            zone: 'lights_zone1',
            state: 'off',
            level: 0
          },
          {
            zone: 'lights_zone2',
            state: 'off',
            level: 0
          },
          {
            zone: 'lights_zone3',
            state: 'off',
            level: 0
          }
        ]
      }
    ]
  }
}