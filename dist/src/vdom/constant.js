'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @author Yoonthe
 * @description 定义各种 vdom 用 常量
 */

// TEXT 专门处理 textNode
var Types = ['INSERT', 'REPLACE', 'REMOVE', 'PROPS', 'TEXT', 'SORT'];

var PatchType = exports.PatchType = Types.reduce(function (mol, t) {
  mol[t] = t.toLowerCase();
  return mol;
}, {});
var PatchTypeList = exports.PatchTypeList = Object.keys(PatchType);