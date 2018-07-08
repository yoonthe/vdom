'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VNode = require('./classes/VNode');

var _VNode2 = _interopRequireDefault(_VNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var h = function h(type, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return new _VNode2.default(type, props, children);
};
exports.default = h;