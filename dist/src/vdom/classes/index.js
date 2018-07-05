'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VNode = require('./VNode');

var _VNode2 = _interopRequireDefault(_VNode);

var _Patch = require('./Patch');

var _Patch2 = _interopRequireDefault(_Patch);

var _Observer = require('./Observer');

var _Observer2 = _interopRequireDefault(_Observer);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @description 定义VDom的类
 * @author Yoonthe
 */

exports.default = {
  VNode: _VNode2.default,
  Patch: _Patch2.default,
  Observer: _Observer2.default,
  Model: _Model2.default
};