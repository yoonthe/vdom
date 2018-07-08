'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Observer = require('./Observer');

var _Observer2 = _interopRequireDefault(_Observer);

var _lang = require('../../utils/lang');

var _lang2 = _interopRequireDefault(_lang);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SymbolFactory = _lang2.default.SymbolFactory,
    isFunction = _lang2.default.isFunction;


var symbol = SymbolFactory('Model');

var State = symbol('State');
var last = symbol('last');
var node = symbol('node');
var Mount = symbol('Mount');
var mountNode = symbol('mountNode');
var init = symbol('init');
var Render = symbol('Render');
var apply = symbol('apply');
var update = symbol('update');

var Model = function () {
  function Model(_ref) {
    var _this = this;

    var _ref$state = _ref.state,
        state = _ref$state === undefined ? {} : _ref$state,
        mount = _ref.mount,
        render = _ref.render,
        args = _objectWithoutProperties(_ref, ['state', 'mount', 'render']);

    _classCallCheck(this, Model);

    this[State] = state;
    this[Mount] = mount;
    this.render = render;
    if (!isFunction(this.render)) {
      throw new Error('Model must get a [render] function!');
    }
    this[last] = null;
    this[mountNode] = null;
    this[Render] = (0, _config.getRender)();

    // 合并props
    Object.keys(args).forEach(function (k) {
      if (isFunction(args[k])) {
        _this[k] = args[k].bind(_this);
        return;
      }
      _this[k] = args[k];
    });

    // 开始初始化
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
      this.state = new _Observer2.default(this[State], function () {
        _this2[apply]();
      });
      // 渲染vnode
      this[node] = render.create(this.render());
      // mountNode
      this[mountNode] = render.mount(this[node], this[Mount]);
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
    value: function value() {
      var render = this[Render];
      console.log('begin update!');
      // 渲染vnode
      var newNode = render.create(this.render());
      // destroyNode
      this[mountNode].removeChild(this[node]);
      // mountNode
      render.mount(newNode, this[Mount]);
      this[node] = newNode;
    }
  }]);

  return Model;
}();

exports.default = Model;