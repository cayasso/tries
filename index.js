'use strict';

/**
 * Expose `Tries`.
 */

module.exports = Tries;

/**
 * Initialize a new `Tries`.
 *
 * @param {Object} options
 * @api private
 */

function Tries(options) {
  if (!(this instanceof Tries)) {
    return new Tries(options);
  }
  options = options || {};
  this.tries = 0;
  this.timer = null;
  this.randomize = !!options.randomize;
  this.min = 'min' in options ? options.min : 100;
  this.max = 'max' in options ? options.max : Infinity;
  this.factor = 'factor' in options ? options.factor : 2;
  this.retries = 'retries' in options ? options.retries : 10;
}

/**
 * Retry operation.
 *
 * @param {Function} fn
 * @return {Server}
 * @api public
 */

Tries.prototype.retry = function retry(fn) {

  if ('function' !== typeof fn) {
    throw new Error('A function is required');
  }

  var me = this;
  var timeout = me.timeout;
  var metrics = {
    timeout: timeout,
    retries: this.tries
  };

  if (me.tries >= me.retries) {
    fn(new Error('Max tries reached'), metrics);
    me.clear();
    return 
  }

  me.timer = setTimeout(function delay() {
    clearTimeout(me.timer);
    fn(null, metrics);
  }, timeout);
 
};

/**
 * Clear retry values.
 *
 * @return {Server}
 * @api public
 */

Tries.prototype.clear = function clear() {
  this.tries = 0;
  clearTimeout(this.timer);
};

/**
 * Generate timeout.
 *
 * @type {Number}
 * @api private
 */

Object.defineProperty(Tries.prototype, 'timeout', {
  get: function get() {   
    var ms = this.min * Math.pow(this.factor, this.tries++);
    if (this.randomize) ms += Math.random();
    return Math.min(ms, this.max) | 0;
  }
});
