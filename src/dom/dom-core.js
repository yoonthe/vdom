let hasDom = true;
let $root = null;
if(!document || !document.createElement) {
  console.error('Can\'t Find DOM! Please ensure you run project in browser');
  hasDom = false;
} else {
  $root = document.getElementById('root');
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
const changed = (node1, node2) => {
  return typeof node1 !== typeof node2 ||
         typeof node1 === 'string' && node1 !== node2 ||
         node1.type !== node2.type
};

const updateElement = ($parent, newNode, oldNode, index = 0) => {
  if (!oldNode) {
    $parent.appendChild(
      createElement(newNode)
    );
  } else if (!newNode) {
    $parent.removeChild(
      $parent.childNodes[index]
    );
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(
      createElement(newNode),
      $parent.childNodes[index]
    );
  } else if (newNode.type) {
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      );
    }
  }
}
/**
 * @method mount
 * @param {HTMLElement} $ele
 */
const mount = ($ele) => {
  $root.appendChild($ele);
}
let old = null;
const render = (node) => {
  if (!old) {
    mount(createElement(node));
  } else {
    updateElement($root, node, old);
  }
}

export default {
  createElement,
  mount,
  updateElement,
  render,
};
