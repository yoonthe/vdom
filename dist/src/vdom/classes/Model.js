'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Observer = require('./Observer');

var _Observer2 = _interopRequireDefault(_Observer);

var _Patch = require('./Patch');

var _Patch2 = _interopRequireDefault(_Patch);

var _lang = require('../../utils/lang');

var _lang2 = _interopRequireDefault(_lang);

var _config = require('../config');

var _handler = require('../../utils/handler');

var _diff = require('../diff');

var _diff2 = _interopRequireDefault(_diff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SymbolFactory = _lang2.default.SymbolFactory,
    isFunction = _lang2.default.isFunction,
    isNull = _lang2.default.isNull;


var symbol = SymbolFactory('Model');

// 输入options
var optionsKey = symbol('options');
// 上一次vnode结构
var oldVNode = symbol('oldVNode');
// 上一次渲染结果
var oldNode = symbol('oldNode');
// 最后一次vnode结构
var vnode = symbol('vnode');
// 最后一次渲染结果
var node = symbol('node');
// 最近的patch集合
var patches = symbol('patches');
// 绑定位置
var mountNode = symbol('mountNode');
// 渲染器
var Render = symbol('Render');
// model 状态 响应式
var stateKey = symbol('state');
// model 状态 getter 静态化 flag
var staticStateFlag = symbol('staticStateFlag');
// 初始化方法
var initFn = symbol('initFn');
// 更新方法
var applyFn = symbol('applyFn');
// 更新实际操作方法
var updateFn = symbol('updateFn');
// 实际render方法
var renderFn = symbol('renderFn');
// 更新promise
var updatePromiseKey = symbol('updatePromise');
// 渲染更新方法
// const dispatchFn = symbol('dispatchFn');
// 渲染更新实际方法
var patchFn = symbol('patchFn');

var Model = function () {
  function Model(options) {
    var _this = this;

    _classCallCheck(this, Model);

    if (!isFunction(options.render)) {
      throw new Error('Model must get a [render] function!');
    }
    this[optionsKey] = _extends({ state: options.state || {} }, options);
    this[updatePromiseKey] = null;
    this[oldVNode] = null;
    this[oldNode] = null;
    this[patches] = [];
    this[mountNode] = null;
    this[staticStateFlag] = false;
    // 开始初始化
    Promise.resolve().then(function () {
      return _this[initFn]();
    });
  }

  _createClass(Model, [{
    key: initFn,
    value: function value() {
      var _this2 = this;

      var _optionsKey = this[optionsKey],
          state = _optionsKey.state,
          render = _optionsKey.render,
          mount = _optionsKey.mount,
          args = _objectWithoutProperties(_optionsKey, ['state', 'render', 'mount']);
      // 获取render


      this[Render] = (0, _config.getRender)();
      var RenderInstance = this[Render];
      _Patch2.default.setRender(RenderInstance);
      // 分发props
      Object.keys(args).forEach(function (argKey) {
        var val = args[argKey];
        if (isFunction(val)) {
          _this2[argKey] = val.bind(_this2);
        } else {
          _this2[argKey] = val;
        }
      });
      // 监听state
      this[stateKey] = new _Observer2.default(state, function () {
        _this2[applyFn]();
      });
      // updateFn, patchFn绑定
      this[updateFn] = this[updateFn].bind(this);
      this[patchFn] = this[patchFn].bind(this);

      // 初始化渲染
      // 渲染vnode
      this[vnode] = this[renderFn]();
      // 生成实际元素
      this[node] = RenderInstance.create(this[vnode]);
      // 挂载元素
      this[mountNode] = RenderInstance.mount(this[node], mount);
      // 解析异常
      (0, _handler.handleErrors)();
    }
  }, {
    key: applyFn,
    value: function value() {
      if (isNull(this[updatePromiseKey])) {
        this[updatePromiseKey] = Promise.resolve().then(this[updateFn]);
      }
    }
  }, {
    key: updateFn,
    value: function value() {
      if ((0, _config.isDebug)()) {
        console.log('begin update!');
        (0, _handler.setTime)();
      }
      // 将上次结果变更
      this[oldVNode] = this[vnode];
      this[oldNode] = this[node];
      this[patches] = [];
      // 渲染vnode
      this[vnode] = this[renderFn]();
      // 产生变更
      this[patches] = (0, _diff2.default)(this[vnode], this[oldVNode], this[oldNode], this[Render]);

      // 同步更新
      this[patchFn]();

      // 解析异常
      (0, _handler.handleErrors)();
      // 清除更新
      this[updatePromiseKey] = null;
    }
    // [dispatchFn]() {
    //   Promise.resolve().then(this[patchFn])
    // }

  }, {
    key: patchFn,
    value: function value() {
      if ((0, _config.isDebug)()) {
        console.log('-------------- Update ---------------');
        console.log(JSON.stringify(this[patches]));
      }
      this[patches].forEach(function (patch) {
        if (isFunction(patch.apply)) {
          patch.apply();
        }
      });
      if ((0, _config.isDebug)()) {
        (0, _handler.setTime)();
      }
    }
  }, {
    key: renderFn,
    value: function value() {
      this[staticStateFlag] = true;
      try {
        var res = this[optionsKey].render.call(this);
        return res;
      } catch (err) {
        (0, _handler.throwError)(err);
      } finally {
        this[staticStateFlag] = false;
      }
    }
  }, {
    key: 'state',
    get: function get() {
      if (this[staticStateFlag]) {
        return this[stateKey].getStatic();
      } else {
        return this[stateKey];
      }
    },
    set: function set(state) {
      var _this3 = this;

      // 监听state
      this[stateKey] = new _Observer2.default(state, function () {
        _this3[applyFn]();
      });
      this[applyFn]();
    }
  }]);

  return Model;
}();

exports.default = Model;