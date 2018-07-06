"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class RenderInterface
 * @description 渲染接口，将VDom渲染为实际页面的方法，包含创建，删除，更新，以及挂载
 */
// @interface
var RenderInterface = function () {
  function RenderInterface() {
    _classCallCheck(this, RenderInterface);
  }

  _createClass(RenderInterface, [{
    key: "create",

    /**
     * create
     * @param {VNode} vnode 
     * @returns {Node} node
     */
    value: function create(vnode) {
      return null;
    }
    /**
     * mount
     * @param {Node} node 
     * @param {String|Node} mount 
     * @returns {Node} mount
     */

  }, {
    key: "mount",
    value: function mount(node, _mount) {
      return null;
    }
    /**
     * insert
     * @param {Node} node 
     * @param {Node} parent 
     * @param {Node} next 
     */

  }, {
    key: "insert",
    value: function insert(node, parent) {
      var next = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    }
    /**
     * delete
     * @param {Node} node 
     * @param {Node} parent 
     */

  }, {
    key: "delete",
    value: function _delete(node, parent) {}
    /**
     * props
     * @param {Node} node 
     * @param {Object} props 
     */

  }, {
    key: "props",
    value: function props(node, _props) {}
    /**
     * replace
     * @param {Node} node 
     * @param {Node} old 
     */

  }, {
    key: "replace",
    value: function replace(node, old) {}
  }]);

  return RenderInterface;
}();

exports.default = RenderInterface;