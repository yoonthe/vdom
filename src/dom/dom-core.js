let hasDom = true;
if(!(document && document.createElement)) {
  console.error('Can\'t Find DOM! Please ensure you run project in browser');
  hasDom = false;
}
/**
 * @method createElement
 * @param {VNode} node
 * @returns {HTMLElement} element
 */
const createElement = (node) => {
  if (!hasDom) return null;
  if ( typeof node === 'string') {
    return document.createTextNode(node);
  } else {
    const $el = document.createElement(node.type);
    node.children.map(createElement).forEach($el.appendChild.bind($el));
    return $el;
  }
}
/**
 * @method mount
 * @param {HTMLElement} $ele
 */
const mount = ($ele) => {
  const $root = document.getElementById('root');
  $root.appendChild($ele);
}

export default {
  createElement,
  mount,
};
