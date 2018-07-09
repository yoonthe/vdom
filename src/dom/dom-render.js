import RenderInterface from '../vdom/interface/RenderInterface';
import { createElement, mount, setProps } from './dom-core';
import lang from '../utils/lang';

const { isNode } = lang;

export default class DomRender extends RenderInterface {
  create(vnode) {
    return createElement(vnode);
  }
  mount(node, $mount) {
    return mount(node, $mount);
  }
  insert(vnode, parent, next = null) {
    parent.insertBefore(this.create(vnode), next);
  }
  replace(vnode, old) {
    if(isNode(old.parentNode)) {
      old.parentNode.replaceChild(this.create(vnode), old);
    }
  }
  remove(node, parent) {
    parent.removeChild(node);
  }
  props(node, props, removeProps) {
    setProps(node, props, removeProps);
  }
  text(node, t) {
    if(node instanceof Text) {
      node.textContent = t.toString();
    }
  }
  getChildren(node) {
    return node.hasChildNodes() ?  Array.from(node.childNodes) : [];
  }
}