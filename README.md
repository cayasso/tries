# back

[![Build Status](https://travis-ci.org/cayasso/tries.svg?branch=master)](https://travis-ci.org/cayasso/tries)
[![NPM version](https://badge.fury.io/js/tries.svg)](http://badge.fury.io/js/tries)

Simple and easy retry and exponential backoff goodness for NodeJS.

## Usage

```js
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


```

## API


### Tries([options])

Create an `Tries` instance.

To create instance you can use:

```js
var tries = Tries(options);
```

or: 

```js
var tries = new Tries(options);
```

Options can be:

 - `min` initial timeout in milliseconds [100]
 - `max` max timeout [Infinite]
 - `retries` max retries [10]
 - `randomize` [false]
 - `factor` [2]

### tries.try([fn])

Execute the passed retry function, this will return in the callback a `metrics` object that contains `retries` and `timeout` values.

### tries.clear()

Reset the number of attempts and the clear the last attempt `setTimeout` if there is one.

## Run Test

```bash
$ make test
```

## License

(The MIT License)

Copyright (c) 2014 Jonathan Brumley &lt;cayasso@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.




