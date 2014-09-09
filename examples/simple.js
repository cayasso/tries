var net = require('netly');
var Trier = require('../');

// Instantiate Trier
var tries = Trier({
  retries: 8,
  min: 500,
  max: 5000,
  factor: 2
});

function reconnect(err) {

  // Retrying
  tries.try(function retry(fail, metrics) {
  
    if (fail) {
      // Ups timeout, no more attempt to reconnect
      // server is not responding.
      console.error('Max attempts reached', metrics);

      // Lets exit, nothing more to do here.
      process.exit(1);
    }

    // Lets get some metrics.
    console.log('Retries: ' + metrics.retries + ' Timeout: ' + metrics.timeout + 'ms');

    // Try to connect again.
    connect();
  });
}

function connect() {

  var sock = net.connect(7999);

  sock.on('error', function () {
    // Ups connection failed, lets attempt a
    // reconnect
    reconnect();
  });

  sock.on('connect', function () {
    // Awesome, we are connected to server
    console.log('Awesome, we are connected');
  });
}

// Lets connect.
connect({});

// Fireup the server
setTimeout(function () {
  net.bind(7999);
}, 10000);

