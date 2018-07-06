'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _Observer = require('./Observer');

var _Observer2 = _interopRequireDefault(_Observer);

var _lang = require('../../utils/lang');

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var symbol = (0, _lang.SymbolFactory)('Model');

var state = symbol('state');
var last = symbol('last');
var node = symbol('node');
var mount = symbol('mount');
var mountNode = symbol('mountNode');
var init = symbol('init');
var Render = symbol('Render');
var apply = symbol('apply');
var update = symbol('update');

var Model = function () {
  function Model(initState, mount) {
    var _this = this;

    _classCallCheck(this, Model);

    this[state] = initState;
    this[mount] = mount;
    this[last] = null;
    this[mountNode] = null;
    this[Render] = (0, _config.getRender)();
    if (!(0, _lodash.isFunction)(this.render)) {
      throw new Error('Model must get a [render] function!');
    }
    Promise.resolve().then(function () {
      return _this[init]();
    });
  }

  _createClass(Model, [{
    key: init,
    value: function value() {
      var _this2 = this;

      var render = this[Render];
      // 监听state
      this.state = new _Observer2.default(this[state], function () {
        _this2[apply]();
      });
      // 渲染vnode
      this[node] = render.create(this.render());
      // mountNode
      this[mountNode] = render.mount(this[node], this[mount]);
    }
  }, {
    key: apply,
    value: function value() {
      var _this3 = this;

      Promise.resolve().then(function () {
        return _this3[update]();
      });
    }
  }, {
    key: update,
    value: function value() {}
  }]);

  return Model;
}();

exports.default = Model;