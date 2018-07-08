/**
 * @author Yoonthe
 * @description 定义各种 vdom 用 常量
 */

// insert 相当于 remove + insert
// TEXT 专门处理 textNode
const Types = ['INSERT', 'REPLACE', 'REMOVE', 'PROPS', 'TEXT'];

export const PatchType = Types.reduce((mol, t) => {
  mol[t] = t.toLowerCase();
  return mol;
}, {});
export const PatchTypeList = Object.keys(PatchType);