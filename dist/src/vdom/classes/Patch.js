'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constant = require('../constant');

var _RenderInterface = require('../interface/RenderInterface');

var _RenderInterface2 = _interopRequireDefault(_RenderInterface);

var _lang = require('../../utils/lang');

var _lang2 = _interopRequireDefault(_lang);

var _VNode = require('./VNode');

var _VNode2 = _interopRequireDefault(_VNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isFunction = _lang2.default.isFunction,
    isNode = _lang2.default.isNode;


var Render = new _RenderInterface2.default();

var Patch = function () {
  function Patch(type) {
    _classCallCheck(this, Patch);

    if (_constant.PatchTypeList.indexOf(type) === -1) {
      throw new Error('Patch should in vdom/constants/PatchType!');
    }
    this.type = type;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    this.args = args;
  }

  _createClass(Patch, [{
    key: 'apply',
    value: function apply() {
      var method = Render[_constant.PatchType[this.type]];
      if (isFunction(method)) {
        method.apply(undefined, _toConsumableArray(this.args));
      }
    }
  }]);

  return Patch;
}();

exports.default = Patch;

_constant.PatchTypeList.forEach(function (type) {
  Patch['' + _constant.PatchType[type]] = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return new (Function.prototype.bind.apply(Patch, [null].concat([type], args)))();
  };
});
/**
 * Patch setRender
 * @param {RenderInterface} render 
 */
Patch.setRender = function (render) {
  if (render instanceof _RenderInterface2.default) {
    Render = render;
  } else {
    throw new Error('[Patch] Render must extend RenderInterface!');
  }
};