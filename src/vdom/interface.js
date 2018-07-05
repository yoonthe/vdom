/**
 * @description 定义VDom的对外接口
 * @author Yoonthe
 */
import { PatchType } from './constant';
/**
 * @class RenderInterface
 * @description 渲染接口，将VDom渲染为实际页面的方法，包含创建，删除，更新，以及挂载
 */
// @interface
export class RenderInterface {
  create(vnode) {
    return null;
  }
  insert(node, parent, next = null) {
  }
  delete(node, parent) {
  }
  props(node, props) {
  }
  replace(node, old) {
  }
}