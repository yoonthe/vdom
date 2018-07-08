/**
 * @author Yoonthe
 * @description 定义各种 vdom 用 常量
 */

import { SymbolFactory } from '../utils/lang';

// Patch
/**
 * @description vdom diff 产出变更类型
 */
const patchSym = SymbolFactory('Patch', true);
// insert 相当于 remove + insert
// TEXT 专门处理 textNode
const Types = ['INSERT', 'REPLACE', 'REMOVE', 'PROPS', 'TEXT'];

export const PatchType = Types.reduce((mol, t) => {
  mol[patchSym(t)] = t.toLowerCase();
  return mol;
}, {});
export const PatchTypeList = Object.getOwnPropertySymbols(PatchType);