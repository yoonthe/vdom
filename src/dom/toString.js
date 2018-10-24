import lang from '../utils/lang';

const { isEmpty } = lang;
/**
 * 
 * @param {Element} node 
 * @returns {String}
 */
export const nodeToString = node => {
  if (node instanceof Text) {
    return `<Text:${node.textContent}>`;
  }
  if (node instanceof Node) {
    const key = node.getAttribute('key');
    const { id } = node;
    let t = '';
    if (!isEmpty(key)) {
      t += `@${key}`;
    }
    if (!isEmpty(id)) {
      t += `#${id}`;
    }
    return `<${node.tagName}${t}${Array.from(node.classList || []).map(className => `.${className}`).join('')}>`;
  }
  return node;
}