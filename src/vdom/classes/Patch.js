import { PatchType, PatchTypeList } from '../constant';
import RenderInterface from '../interface/RenderInterface';
import lang from '../../utils/lang';
import { patchToString } from '../utils/toString';
// import VNode from './VNode';

const { isFunction } = lang;

let Render = new RenderInterface();

export default class Patch {
  constructor(type, ...args) {
    if (PatchTypeList.indexOf(type) === -1) {
      throw new Error('Patch should in vdom/constants/PatchType!');
    }
    this.type = type;
    this.args = args;
  }
  apply() {
    const method = Render[PatchType[this.type]];
    if (isFunction(method)) {
      method.call(Render, ...this.args);
    }
  }
  toString() {
    return patchToString(this);
  }
}
PatchTypeList.forEach(type => {
  Patch[`${PatchType[type]}`] = (...args) => new Patch(type, ...args);
})
/**
 * Patch setRender
 * @param {RenderInterface} render 
 */
Patch.setRender = render => {
  if (render instanceof RenderInterface) {
    Render = render;
  } else {
    throw new Error('[Patch] Render must extend RenderInterface!');
  }
}