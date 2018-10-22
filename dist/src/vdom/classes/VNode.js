'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lang = require('../../utils/lang');

var _lang2 = _interopRequireDefault(_lang);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class VNode
 * @description 虚拟元素类
 */
var VNode = function VNode(type, props, children) {
  _classCallCheck(this, VNode);

  this.type = type;
  this.props = props;
  this.children = _lang2.default.flatten(children);
};

exports.default = VNode;