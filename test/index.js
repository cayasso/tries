var net = require('netly');
var Tries = require('..');

describe('Tries', function () {
  
  it('should have retry and clear methods', function () {
    var tries = Tries();
    tries.retry.should.be.Function;
    tries.clear.should.be.Function;
    tries.timeout.should.be.Number;
  });

  it('should allow passing options', function () {

    var options = {
      min: 50,
      max: 1000,
      factor: 3,
      retries: 3,
      randomize: true
    };

    var tries = Tries(options);
    tries.min.should.be.eql(options.min);
    tries.max.should.be.eql(options.max);
    tries.factor.should.be.eql(options.factor);
    tries.retries.should.be.eql(options.retries);
    tries.randomize.should.be.eql(options.randomize);
  });

  describe('.timeout', function () {
    it('should increase backoff', function () {
      var tries = new Tries();
      tries.timeout.should.be.eql(100);
      tries.timeout.should.be.eql(200);
      tries.timeout.should.be.eql(400);
      tries.timeout.should.be.eql(800);
      tries.clear();
      tries.timeout.should.be.eql(100);
      tries.timeout.should.be.eql(200);
    });
  })

  describe('.retry', function () {
    
    it('should increase backoff', function (done) {

      var timeouts = [100, 200, 400, 800];
      var tries = Tries();

      function retry() {
        tries.retry(function (fail, metrics) {
          if (metrics.retries >= 4) {
            tries.clear();
            return done();
          }          
          metrics.timeout.should.be.eql(timeouts[metrics.retries - 1]);
          connect();
        });
      }
      
      function connect() {
        net.connect(1989).on('error', retry);
      }

      connect();
    });

    it('should fail on max attempts reached', function (done) {

      var tries = Tries({ retries: 3 });

      function retry() {
        tries.retry(function (fail, metrics) {
          if (fail) {
            metrics.retries.should.eql(3);
            tries.clear();
            return done();
          }
          connect();
        });
      }
      
      function connect() {
        net.connect(1989).on('error', retry);
      }

      connect();
    });

    it('should do a real example :-)', function (done) {

      var port = 1989;
      var tries = Tries();

      function retry() {
        tries.retry(function (fail, metrics) {
          if (fail) {
            metrics.retries.should.eql(3);
            return done();
          }
          connect();
        });
      }
      
      function connect() {
        var sock = net.connect(port);
        sock.on('connect', function () { 
          tries.clear() 
          done();
        });
        sock.on('error', retry);
      }

      connect();

      setTimeout(function () {
        net.bind(port);
      }, 100);
    });

  })

  describe('.clear', function () {
    it('should clear attempts', function () {
      var tries = Tries();
      tries.retry(function (fail) {
        throw Error('should not call');
      });
      tries.clear();
      tries.tries.should.be.eql(0);
    });
  })  

});