/**
 * @class VNode
 * @description 虚拟元素类
 */
export default class VNode {
  constructor(type,  props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
  }
}