'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var state = Symbol('Model#State');

var Model = function () {
  function Model(initState) {
    _classCallCheck(this, Model);

    this[state] = initState;
    this.state = new Proxy(this[state], {
      get: function get() {}
    });
  }

  _createClass(Model, [{
    key: 'state',
    get: function get() {
      return;
    }
  }]);

  return Model;
}();

exports.default = Model;