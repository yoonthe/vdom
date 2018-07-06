import RenderInterface from '../vdom/interface/RenderInterface';
import { createElement, mount } from './dom-core';

export default class DomRender extends RenderInterface {
  create(vnode) {
    return createElement(vnode);
  }
  mount(node, $mount) {
    return mount(node, $mount);
  }
}