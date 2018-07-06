'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRender = exports.setRender = undefined;

var _interface = require('../interface');

var config = {
  render: new _interface.RenderInterface()
};
/**
 * setRender
 * @param {Renderinterface} render 
 * @returns {Boolean} scsFlag
 */
var setRender = exports.setRender = function setRender(render) {
  if (render instanceof _interface.RenderInterface) {
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