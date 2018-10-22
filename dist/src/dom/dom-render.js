'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RenderInterface2 = require('../vdom/interface/RenderInterface');

var _RenderInterface3 = _interopRequireDefault(_RenderInterface2);

var _domCore = require('./dom-core');

var _lang = require('../utils/lang');

var _lang2 = _interopRequireDefault(_lang);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isNode = _lang2.default.isNode;

var DomRender = function (_RenderInterface) {
  _inherits(DomRender, _RenderInterface);

  function DomRender() {
    _classCallCheck(this, DomRender);

    return _possibleConstructorReturn(this, (DomRender.__proto__ || Object.getPrototypeOf(DomRender)).apply(this, arguments));
  }

  _createClass(DomRender, [{
    key: 'create',
    value: function create(vnode) {
      return (0, _domCore.createElement)(vnode);
    }
  }, {
    key: 'mount',
    value: function mount(node, $mount) {
      return (0, _domCore.mount)(node, $mount);
    }
  }, {
    key: 'insert',
    value: function insert(vnode, parent) {
      var next = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      parent.insertBefore(this.create(vnode), next);
    }
  }, {
    key: 'replace',
    value: function replace(vnode, old) {
      if (isNode(old.parentNode)) {
        old.parentNode.replaceChild(this.create(vnode), old);
      }
    }
  }, {
    key: 'remove',
    value: function remove(node, parent) {
      parent.removeChild(node);
    }
  }, {
    key: 'props',
    value: function props(node, _props, removeProps) {
      (0, _domCore.setProps)(node, _props, removeProps);
    }
  }, {
    key: 'text',
    value: function text(node, t) {
      if (node instanceof Text) {
        node.textContent = t.toString();
      }
    }
  }, {
    key: 'sort',
    value: function sort(node, parent, next) {
      parent.insertBefore(node, next);
    }
  }, {
    key: 'getChildren',
    value: function getChildren(node) {
      return node.hasChildNodes() ? Array.from(node.childNodes) : [];
    }
  }]);

  return DomRender;
}(_RenderInterface3.default);

exports.default = DomRender;