import xapi from 'xapi';

var that;


export function onReady() {
  that = this;
  console.log('Module loader is ready!');
  console.log('This log comes from module1. Now calling a function in module2...');
  that.modules.mod2.module2FunctionWhatever();
  console.log('Now, make module3 call a module1 function (like a callback?)');
  that.modules.mod3.callFunction(test);
}

function test() {
  console.log('Still logs from module1!');
}

