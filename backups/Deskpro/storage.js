import xapi from 'xapi';

/* SYSTEM RESERVED VARIABLES

system.booting
system.ready





*/


export class Globals {
  constructor() {
    this.globals = [];
    this.listeners = [];
  }
  vars(name) {
    return {
      set:func => {
        return this._setVar(name, func);
      },
      get: func => {
        return this.globals[name];
      },
      onChange: func => {
        return this._addListener(name, func);
      }
    }
  }
  _setVar(name, value) {
    this.globals[name] = value;
    this.listeners.forEach(listener => {
      if (listener.name == name) {
        listener.callback();
      }
    });
  }
  _addListener(n, c) {
    this.listeners.push({ name:n, callback:c});
  }
}