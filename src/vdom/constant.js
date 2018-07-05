/**
 * @description vdom diff 产出变更类型
 */
export const PatchType = {
  [Symbol.for('Patch#CREATE')] : 'create',
  [Symbol.for('Patch#REPLACE')]: 'replace',
  [Symbol.for('Patch#DELETE')]: 'delete',
  [Symbol.for('Patch#PROPS')]: 'props',
  [Symbol.for('Patch#TEXT')]: 'text',
}

export const PatchTypeList = Object.keys(PatchType);