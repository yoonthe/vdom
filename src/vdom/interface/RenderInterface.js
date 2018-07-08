import VNode from '../classes/VNode';
/**
 * @class RenderInterface
 * @description 渲染接口，将VDom渲染为实际页面的方法，包含创建，删除，更新，以及挂载
 */
// @interface
export default class RenderInterface {
  /**
   * create
   * @param {VNode} vnode 
   * @returns {Node} node
   */
  create(vnode) {
    return null;
  }
  /**
   * mount
   * @param {Node} node 
   * @param {String|Node} mount 
   * @returns {Node} mount
   */
  mount(node, mount) {
    return null;
  }
  /**
   * insert
   * @param {Node} node 
   * @param {Node} parent 
   * @param {Node} next 
   */
  insert(node, parent, next) {
  }
  /**
   * remove
   * @param {Node} node 
   * @param {Node} parent 
   */
  remove(node, parent) {
  }
  /**
   * props
   * @param {Node} node 
   * @param {Object} props
   * @param {Object} removeProps
   */
  props(node, props, removeProps) {
  }
  /**
   * replace
   * @param {Node} node 
   * @param {Node} old 
   */
  replace(node, old) {
  }
  /**
   * replace
   * @param {Node} node 
   * @param {*} t 
   */
  text(node, t) {
  }
  /**
   * getChildren
   * @param {Node} node
   * @returns {Node[]} children
   */
  getChildren(node) {
    return [];
  }
}