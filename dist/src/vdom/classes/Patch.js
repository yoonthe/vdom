'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constant = require('../constant');

var _interface = require('../interface');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Patch = function () {
  function Patch(type, node, data) {
    _classCallCheck(this, Patch);

    if (_constant.PatchTypeList.indexOf(type) === -1) {
      throw new Error('Patch should use vdom/constants/PatchType Symbol!');
    }
    this.type = type;
    this.node = node;
    this.data = data;
    this.render = null;
  }

  _createClass(Patch, [{
    key: 'setRender',
    value: function setRender(render) {
      if (render instanceof _interface.RenderInterface) {
        this.render = render;
      } else {
        throw new Error('Render must extend RenderInterface!');
      }
    }
  }, {
    key: 'apply',
    value: function apply() {
      this.render[_constant.PatchType[this.type]](this.node, this.data);
    }
  }]);

  return Patch;
}();

exports.default = Patch;