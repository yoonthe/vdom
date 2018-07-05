'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stateKey = Symbol('Observer#state');

var Observer = function Observer(state, callback) {
  _classCallCheck(this, Observer);

  if ((0, _lodash.isObject)(state) && !(0, _lodash.isFunction)(state)) {
    this[stateKey] = state;
    return new Proxy(this, {
      get: function get(target, key, receiver) {
        if (key === stateKey) {
          return this[stateKey];
        }
        var val = Reflect.get(target[stateKey], key, receiver);
        if ((0, _lodash.isObject)(val) && !(0, _lodash.isFunction)(val) && !(val instanceof Observer)) {
          val = new Observer(val, callback);
          target[stateKey][key] = val;
          // Reflect.set(target[stateKey], key, val, receiver)
        }
        return val;
      },
      set: function set(target, key, value, receiver) {
        // TODO: 回调
        var val = value;
        if ((0, _lodash.isFunction)(callback)) callback();
        if ((0, _lodash.isObject)(val) && !(0, _lodash.isFunction)(val)) {
          val = new Observer(val, callback);
        }
        target[stateKey][key] = val;
        return true;
        // return Reflect.set(target[stateKey], key, val, receiver);
      }
    });
  }
  return state;
};

exports.default = Observer;