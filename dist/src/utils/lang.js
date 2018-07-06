"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SymbolFactory = exports.SymbolFactory = function SymbolFactory(title) {
  var getable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return function (desc) {
    var get = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return getable || get ? Symbol.for(title + "#" + desc) : Symbol(title + "#" + desc);
  };
};