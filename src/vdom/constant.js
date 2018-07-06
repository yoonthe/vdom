import { SymbolFactory } from '../utils/lang';
/**
 * @description vdom diff 产出变更类型
 */
const patchSym = SymbolFactory('Patch', true);
export const PatchType = {
  [patchSym('CREATE')] : 'create',
  [patchSym('REPLACE')]: 'replace',
  [patchSym('DELETE')]: 'delete',
  [patchSym('PROPS')]: 'props',
  [patchSym('TEXT')]: 'text',
}

export const PatchTypeList = Object.keys(PatchType);