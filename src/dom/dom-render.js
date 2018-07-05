import { RenderInterface } from '../vdom/interface';

export default class DomRender extends RenderInterface {
  create(node, parent) {
    parent.appendChild(node);
  }
  
}