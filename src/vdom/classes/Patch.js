import { PatchType, PatchTypeList } from '../constant';
import { RenderInterface } from '../interface';

export default class Patch {
  constructor(type, node, data) {
    if (PatchTypeList.indexOf(type) === -1) {
      throw new Error('Patch should use vdom/constants/PatchType Symbol!');
    }
    this.type = type;
    this.node = node;
    this.data = data;
    this.render = null;
  }
  setRender(render) {
    if (render instanceof RenderInterface) {
      this.render = render;
    } else {
      throw new Error('Render must extend RenderInterface!');
    }
  }
  apply() {
    this.render[PatchType[this.type]](this.node, this.data);
  }
}