import Patch from '../classes/Patch';
import { PatchType } from '../constant';
import { nodeToString } from '../../dom/toString';

/**
 * 
 * @param {Patch} patch 
 * @param {String} patch.type 'INSERT', 'REPLACE', 'REMOVE', 'PROPS', 'TEXT', 'SORT'
 * @param {Any[]} patch.args
 * @returns {String}
 */
export const patchToString = (patch) => {
  const { args } = patch;
  switch(PatchType[patch.type]) {
    case PatchType.INSERT:
      return `Insert VNode: ${args[0]} to Placement: Parent: ${nodeToString(args[1])}, NextSibling: ${nodeToString(args[2])}`;
    case PatchType.REPLACE:
      return `Replace VNode ${args[0]} to Node ${nodeToString(args[1])}`;
    case PatchType.REMOVE:
      return `Remove Node ${nodeToString(args[0])} from Parent: ${nodeToString(args[1])}`;
    case PatchType.PROPS:
      return `Update Node ${nodeToString(args[0])} 's props, AddOrUpdate Props: ${JSON.stringify(args[1])}, remove Props: ${JSON.stringify(args[2])}`;
    case PatchType.TEXT:
      return `Update TextNode ${nodeToString(args[0])} 's content to ${args[1]}`
    case PatchType.SORT:
      return `Move Node ${nodeToString(args[0])} to Placement: Parent: ${nodeToString(args[1])}, NextSibling: ${nodeToString(args[2])}`;
    default:
      return `Type: ${patch.type}, Args: ${patch.args}`;
  }
}