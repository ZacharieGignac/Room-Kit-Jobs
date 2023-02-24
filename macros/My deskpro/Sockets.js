import xapi from 'xapi';
var working = false;
var queue = [];

function request(args) {
  if (!working) {
    console.log(`Socket is available, direct request`);
    working = true;
    requestNext(args);
  }
  else {
    console.log(`Socket is unavailable, adding request to queue`);
    queue.push(args);
  }
}
function requestNext(args) {
  console.log(`Requesting ${args}`);
  xapi.Command.HttpClient.Get({
    Timeout: 2,
    Url: `http://10.12.48.116/aj.html?${args}`
  }).then(result => {
    working = false;
    checkQueue();
  }).catch(err => {
    working = false;
    checkQueue();
  });
}
function checkQueue() {
  console.log(`Checking request queue`);
  if (queue.length > 0) {
    console.log(`Queue is not empty (${queue.length})`);
    requestNext(queue.pop());
  }
  else {
    console.log(`Queue is empty.`);
  }
}



request("a=1&b=2");
request("a=2&b=3");
request("a=4&b=69");
request("a=1&b=2");
request("a=2&b=3");
request("a=4&b=69");

