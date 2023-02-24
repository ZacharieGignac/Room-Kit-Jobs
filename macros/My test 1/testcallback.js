import xapi from 'xapi';

function execute(f) {
  console.log(f);
  f.func();
}

execute({
  func:() => console.log('test')
});
