import { isString, isNull, isUndefined, isArray, isObject, isElement, isFunction } from 'lodash';
import VNode from '../vdom/classes/VNode';

const formatProp = obj => {
  if(isFunction(obj)) {
    return obj;
  }
  if(isArray(obj)) {
    return obj.map(obj => formatProp(obj)).join(' ');
  }
  if(isObject(obj)) {
    return Object.keys(obj).reduce((mol, k) => {
      const val = obj[k];
      if(isBoolean(val)) {
        return `${mol} ${val ? k : '' }`;
      }
      return `${mol} ${k}:${val};`
    }, '');
  }
  if(isNull(obj) || isUndefined(obj)) {
    return '';
  }
  return toString.call(obj);
}
/**
 * @description 对于
 */
let hasDom = true;
if(!document || !document.createElement) {
  console.error('Can\'t Find DOM! Please ensure you run project in browser');
  hasDom = false;
}
/**
 * @method createElement
 * @param {VNode} vnode
 * @returns {HTMLElement} element
 */
export const createElement = (vnode) => {
  if (!hasDom) return null;
  if ( typeof vnode === 'string') {
    return document.createTextNode(vnode);
  } else if(vnode instanceof VNode) {
    const { type, props, children } = vnode;
    const $el = document.createElement(type);
    setProps($el, props);
    children.map(createElement).forEach($el.appendChild.bind($el));
    return $el;
  }
  return null;
}

/**
 * setProps
 * @param {HTMLElement} node 
 * @param {Object} props 
 */
const setProps = (node, props) => {
  if (isNull(props) || isUndefined(props)) {
    return;
  }
  const ks = Object.keys(props);
  ks.forEach(key => {
    const val = props[key];
    if (isFunction(val)) {
      node[key.toLowerCase()] = val;
      return;
    }
    switch(key) {
      // case 'className': 
      default: 
      node.setAttribute(key, formatProp(props[key]));
    }
  })
}
const changed = (node1, node2) => {
  return typeof node1 !== typeof node2 ||
         typeof node1 === 'string' && node1 !== node2 ||
         node1.type !== node2.type
};

const updateElement = ($parent, newNode, oldNode, index = 0) => {
  if (!oldNode) {
    // 添加新元素
    $parent.appendChild(
      createElement(newNode)
    );
  } else if (!newNode) {
    // 移除元素
    $parent.removeChild(
      $parent.childNodes[index]
    );
  } else if (changed(newNode, oldNode)) {
    // 替换元素
    $parent.replaceChild(
      createElement(newNode),
      $parent.childNodes[index]
    );
  } else if (newNode.type) {
    // 对元素的下一级进行更新
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
 * @param {HTMLElement} $el
 * @param {String|HTMLElement} mount
 */
export const mount = ($el, mount) => {
  let t = mount;
  if(isString(t)) {
    t = document.querySelector(t);
  }
  if(isElement(t) && isElement($el)) {
    t.appendChild($el);
  }
}
let old = null;
const render = (node) => {
  if (!old) {
    old = node;
    mount(createElement(node));
  } else {
    updateElement($root, node, old);
  }
}
