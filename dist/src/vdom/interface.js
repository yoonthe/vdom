'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderInterface = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @description 定义VDom的对外接口
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Yoonthe
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _constant = require('./constant');

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
    key: 'create',
    value: function create(vnode) {
      return null;
    }
  }, {
    key: 'insert',
    value: function insert(node, parent) {
      var next = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    }
  }, {
    key: 'delete',
    value: function _delete(node, parent) {}
  }, {
    key: 'props',
    value: function props(node, _props) {}
  }, {
    key: 'replace',
    value: function replace(node, old) {}
  }]);

  return RenderInterface;
}();

exports.RenderInterface = RenderInterface;