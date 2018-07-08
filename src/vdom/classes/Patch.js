import { PatchType, PatchTypeList } from '../constant';
import RenderInterface from '../interface/RenderInterface';
import lang from '../../utils/lang';
import VNode from './VNode';

const { isFunction, isNode } = lang;

let Render = new RenderInterface();

export default class Patch {
  constructor(type, node, ...args) {
    if (PatchTypeList.indexOf(type) === -1) {
      throw new Error('Patch should in vdom/constants/PatchType!');
    }
    this.type = type;
    this.node = node;
    this.data = args;
  }
  apply() {
    const method = Render[PatchType[this.type]];
    if (isFunction(method)) {
      method(isNode(this.node) ? this.node : Render.create(this.node), ...this.data);
    }
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