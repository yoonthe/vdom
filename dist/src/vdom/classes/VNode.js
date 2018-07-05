"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class VNode
 * @description 虚拟元素类
 */
var VNode = function VNode(type, props, children) {
  _classCallCheck(this, VNode);

  this.type = type;
  this.props = props;
  this.children = children;
};

exports.default = VNode;