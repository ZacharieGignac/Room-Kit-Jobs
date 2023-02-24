import xapi from 'xapi';

function FunctionQueue(delay) {
  this.queue = [];
  this.delay = delay;
  this.running = false;
}

FunctionQueue.prototype.add = function(fn) {

  this.queue.push({ fn: fn  });
  if (!this.running) this.run();
};

FunctionQueue.prototype.run = function() {
  var self = this;
  if (this.queue.length === 0) {
    this.running = false;
    return;
  }
  this.running = true;
  var item = this.queue.shift();
  item.fn();
  setTimeout(function() {
    self.run();
  }, self.delay);
};

var queue = new FunctionQueue(1000);
queue.add(() => { console.log('testttttttttt')});
queue.add(() => { console.log('testttttttttt')});
queue.add(() => { console.log('testttttttttt')});
queue.add(() => { console.log('testttttttttt')});
queue.add(() => { console.log('testttttttttt')});