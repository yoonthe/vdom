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
    return `<${node.tagName}${node.id ? `#${node.id}` : ''}${Array.from(node.classList || []).map(className => `.${className}`).join('')}>`;
  }
  return node;
}