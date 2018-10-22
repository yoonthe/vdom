'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDebug = exports.enableDebug = exports.getRender = exports.setRender = undefined;

var _RenderInterface = require('./interface/RenderInterface');

var _RenderInterface2 = _interopRequireDefault(_RenderInterface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  render: new _RenderInterface2.default(),
  debug: false
};
/**
 * setRender
 * @param {Renderinterface} render 
 * @returns {Boolean} scsFlag
 */
var setRender = exports.setRender = function setRender(render) {
  if (render instanceof _RenderInterface2.default) {
    config.render = render;
    return true;
  } else {
    return false;
  }
};

/**
 * getRender
 * @returns {RenderInterface} render
 */
var getRender = exports.getRender = function getRender() {
  return config.render;
};

var enableDebug = exports.enableDebug = function enableDebug() {
  return config.debug = true;
};

var isDebug = exports.isDebug = function isDebug() {
  return config.debug;
};