'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PatchType;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @description vdom diff 产出变更类型
 */
var PatchType = exports.PatchType = (_PatchType = {}, _defineProperty(_PatchType, Symbol.for('Patch#CREATE'), 'create'), _defineProperty(_PatchType, Symbol.for('Patch#REPLACE'), 'replace'), _defineProperty(_PatchType, Symbol.for('Patch#DELETE'), 'delete'), _defineProperty(_PatchType, Symbol.for('Patch#PROPS'), 'props'), _defineProperty(_PatchType, Symbol.for('Patch#TEXT'), 'text'), _PatchType);

var PatchTypeList = exports.PatchTypeList = Object.keys(PatchType);