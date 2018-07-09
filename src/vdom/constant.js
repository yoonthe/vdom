/**
 * @author Yoonthe
 * @description 定义各种 vdom 用 常量
 */

// TEXT 专门处理 textNode
const Types = ['INSERT', 'REPLACE', 'REMOVE', 'PROPS', 'TEXT', 'SORT'];

export const PatchType = Types.reduce((mol, t) => {
  mol[t] = t.toLowerCase();
  return mol;
}, {});
export const PatchTypeList = Object.keys(PatchType);