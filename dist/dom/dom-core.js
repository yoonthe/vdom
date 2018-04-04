'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var hasDom = true;
var $root = null;
if (!document || !document.createElement) {
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
var createElement = function createElement(node) {
  if (!hasDom) return null;
  if (typeof node === 'string') {
    return document.createTextNode(node);
  } else {
    var $el = document.createElement(node.type);
    node.children.map(createElement).forEach($el.appendChild.bind($el));
    return $el;
  }
};
var changed = function changed(node1, node2) {
  return (typeof node1 === 'undefined' ? 'undefined' : _typeof(node1)) !== (typeof node2 === 'undefined' ? 'undefined' : _typeof(node2)) || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type;
};

var updateElement = function updateElement($parent, newNode, oldNode) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (!oldNode) {
    $parent.appendChild(createElement(newNode));
  } else if (!newNode) {
    $parent.removeChild($parent.childNodes[index]);
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
  } else if (newNode.type) {
    var newLength = newNode.children.length;
    var oldLength = oldNode.children.length;
    for (var i = 0; i < newLength || i < oldLength; i++) {
      updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
    }
  }
};
/**
 * @method mount
 * @param {HTMLElement} $ele
 */
var mount = function mount($ele) {
  $root.appendChild($ele);
};
var old = null;
var render = function render(node) {
  if (!old) {
    mount(createElement(node));
  } else {
    updateElement($root, node, old);
  }
};

exports.default = {
  createElement: createElement,
  mount: mount,
  updateElement: updateElement,
  render: render
};