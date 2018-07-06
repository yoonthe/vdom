import VNode from './classes/VNode';
const h = (type, props, ...children) => {
  return new VNode(type, props, children);
};
export default h;