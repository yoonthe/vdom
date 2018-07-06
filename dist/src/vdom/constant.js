'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PatchTypeList = exports.PatchType = undefined;

var _PatchType;

var _lang = require('../utils/lang');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @description vdom diff 产出变更类型
 */
var patchSym = (0, _lang.SymbolFactory)('Patch', true);
var PatchType = exports.PatchType = (_PatchType = {}, _defineProperty(_PatchType, patchSym('CREATE'), 'create'), _defineProperty(_PatchType, patchSym('REPLACE'), 'replace'), _defineProperty(_PatchType, patchSym('DELETE'), 'delete'), _defineProperty(_PatchType, patchSym('PROPS'), 'props'), _defineProperty(_PatchType, patchSym('TEXT'), 'text'), _PatchType);

var PatchTypeList = exports.PatchTypeList = Object.keys(PatchType);