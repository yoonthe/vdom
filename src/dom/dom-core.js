import lang from '../utils/lang';
import { throwError } from '../utils/handler';
import VNode from '../vdom/classes/VNode';
import { AllEvents } from './constant';
// TODO: 事件代理 delegate

const { isFunction, isArray, isObject, isUnval, isString, isNode, isNull, isBoolean } = lang;
const empty = '';
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
  if(isUnval(obj)) {
    return '';
  }
  return obj.toString();
}
/**
 * @description  各种监测
 */
// 是否包含document
let hasDom = true;
if(!document || !document.createElement) {
  console.error('Can\'t Find DOM! Please ensure you run this project in browser');
  hasDom = false;
}

// AddEventListener 是否支持options
let passiveSupported = false;

try {
  var options = Object.defineProperty({}, "passive", {
    get: function() {
      passiveSupported = true;
    }
  });

  window.addEventListener("test", null, options);
} catch(err) {}

/**
 * @method createElement
 * @param {VNode} vnode
 * @returns {HTMLElement} element
 */
export const createElement = (vnode) => {
  if (isUnval(vnode) || !hasDom) {
    return null;
  } else if ( isString(vnode)) {
    return document.createTextNode(vnode);
  } else if(vnode instanceof VNode) {
    const { type, props, children } = vnode;
    const $el = document.createElement(type);
    setProps($el, props);
    children.map(createElement).forEach(element => {
      if (isNode(element)) {
        $el.appendChild(element);
      }
    });
    return $el;
  }
  return document.createTextNode(vnode.toString());
}

const optionConnector = '_';
const eventPropRegExp = new RegExp(`^on([A-Z][a-z]+)((${optionConnector}[a-z]+)*)$`);
const convertOption = arr => {
  const option = {};
  arr.forEach(key => option[key] = true);
  return option;
}
const execProp = key => {
  const execs = eventPropRegExp.exec(key);
  if (!isNull(execs)) {
    const eventName = execs[1].toLowerCase();
    if (AllEvents.indexOf(eventName) > -1) {
      const options = passiveSupported ? convertOption(execs[2].slice(1).split('_')) : execs[2].indexOf('capture') > -1;
      return { eventName, options };
    } else {
      throwError(new Error(`Eventname ${eventName} is't corrected or not be supported!`));
    }
  } else {
    throwError(new Error(`EventListener's key can't be formated! Check the ${key}.`));
  }
  return null;
}
/**
 * setProp
 * @param {Node} node 
 * @param {String} key 
 * @param {String} val 
 * @param {Boolean} removeFlag
 */
const setProp = (node, key, val, removeFlag = false) => {
  switch(key) {
    case 'className': 
    // 设置class
    if (removeFlag) {
      node[key] = empty;
    } else {
      node[key] = formatProp(val);
    }
    default: 
    if (removeFlag) {
      node.removeAttribute(key);
    } else {
      node.setAttribute(key, formatProp(val));
    }
  }
}
/**
 * setProps
 * @param {HTMLElement} node 
 * @param {Object} props 
 * @param {Object} removeProps
 */
export const setProps = (node, props, removeProps) => {
  // 移除 props
  if (!isUnval(removeProps)) {
    const rmKs = Object.keys(removeProps);
    rmKs.forEach(key => {
      const rmVal = removeProps[key];
      if (isFunction(rmVal)) {
        const data = execProp(key);
        if (!isNull(data)) {
          node.removeEventListener(data.eventName, val, data.options);
        }
        return;
      }
      setProp()
    })
  }
  // 添加 props
  if (isUnval(props)) {
    return;
  }
  const ks = Object.keys(props);
  ks.forEach(key => {
    const val = props[key];
    if (isFunction(val)) {
      const data = execProp(key);
      if (!isNull(data)) {
        node.addEventListener(data.eventName, val, data.options);
      }
      return;
    }
    setProp(node, key, val);
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
  if(isNode(t) && isNode($el)) {
    t.appendChild($el);
  }
  return t;
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
