'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mount = exports.setProps = exports.createElement = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lang = require('../utils/lang');

var _lang2 = _interopRequireDefault(_lang);

var _handler = require('../utils/handler');

var _VNode = require('../vdom/classes/VNode');

var _VNode2 = _interopRequireDefault(_VNode);

var _constant = require('./constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: 事件代理 delegate

var isFunction = _lang2.default.isFunction,
    isArray = _lang2.default.isArray,
    isObject = _lang2.default.isObject,
    isUnval = _lang2.default.isUnval,
    isString = _lang2.default.isString,
    isNode = _lang2.default.isNode,
    isNull = _lang2.default.isNull,
    isBoolean = _lang2.default.isBoolean;

var empty = '';
var formatProp = function formatProp(obj) {
  if (isFunction(obj)) {
    return obj;
  }
  if (isArray(obj)) {
    return obj.map(function (obj) {
      return formatProp(obj);
    }).join(' ');
  }
  if (isObject(obj)) {
    return Object.keys(obj).reduce(function (mol, k) {
      var val = obj[k];
      if (isBoolean(val)) {
        return mol + ' ' + (val ? k : '');
      }
      return mol + ' ' + k + ':' + val + ';';
    }, '');
  }
  if (isUnval(obj)) {
    return '';
  }
  return obj.toString();
};
/**
 * @description  各种监测
 */
// 是否包含document
var hasDom = true;
if (!document || !document.createElement) {
  console.error('Can\'t Find DOM! Please ensure you run this project in browser');
  hasDom = false;
}

// AddEventListener 是否支持options
var passiveSupported = false;

try {
  var options = Object.defineProperty({}, "passive", {
    get: function get() {
      passiveSupported = true;
    }
  });

  window.addEventListener("test", null, options);
} catch (err) {}

/**
 * @method createElement
 * @param {VNode} vnode
 * @returns {HTMLElement} element
 */
var createElement = exports.createElement = function createElement(vnode) {
  if (isUnval(vnode) || !hasDom) {
    return null;
  } else if (isString(vnode)) {
    return document.createTextNode(vnode);
  } else if (vnode instanceof _VNode2.default) {
    var type = vnode.type,
        props = vnode.props,
        children = vnode.children;

    var $el = document.createElement(type);
    setProps($el, props);
    children.map(createElement).forEach(function (element) {
      if (isNode(element)) {
        $el.appendChild(element);
      }
    });
    return $el;
  }
  return document.createTextNode(vnode.toString());
};

var optionConnector = '_';
var eventPropRegExp = new RegExp('^on([A-Z][a-z]+)((' + optionConnector + '[a-z]+)*)$');
var convertOption = function convertOption(arr) {
  var option = {};
  arr.forEach(function (key) {
    return option[key] = true;
  });
  return option;
};
var execProp = function execProp(key) {
  var execs = eventPropRegExp.exec(key);
  if (!isNull(execs)) {
    var eventName = execs[1].toLowerCase();
    if (_constant.AllEvents.indexOf(eventName) > -1) {
      var _options = passiveSupported ? convertOption(execs[2].slice(1).split('_')) : execs[2].indexOf('capture') > -1;
      return { eventName: eventName, options: _options };
    } else {
      (0, _handler.throwError)(new Error('Eventname ' + eventName + ' is\'t corrected or not be supported!'));
    }
  } else {
    (0, _handler.throwError)(new Error('EventListener\'s key can\'t be formated! Check the ' + key + '.'));
  }
  return null;
};
/**
 * setProp
 * @param {Node} node 
 * @param {String} key 
 * @param {String} val 
 * @param {Boolean} removeFlag
 */
var setProp = function setProp(node, key, val) {
  var removeFlag = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  switch (key) {
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
};
/**
 * setProps
 * @param {HTMLElement} node 
 * @param {Object} props 
 * @param {Object} removeProps
 */
var setProps = exports.setProps = function setProps(node, props, removeProps) {
  // 移除 props
  if (!isUnval(removeProps)) {
    var rmKs = Object.keys(removeProps);
    rmKs.forEach(function (key) {
      var rmVal = removeProps[key];
      if (isFunction(rmVal)) {
        var data = execProp(key);
        if (!isNull(data)) {
          node.removeEventListener(data.eventName, val, data.options);
        }
        return;
      }
      setProp();
    });
  }
  // 添加 props
  if (isUnval(props)) {
    return;
  }
  var ks = Object.keys(props);
  ks.forEach(function (key) {
    var val = props[key];
    if (isFunction(val)) {
      var data = execProp(key);
      if (!isNull(data)) {
        node.addEventListener(data.eventName, val, data.options);
      }
      return;
    }
    setProp(node, key, val);
  });
};
var changed = function changed(node1, node2) {
  return (typeof node1 === 'undefined' ? 'undefined' : _typeof(node1)) !== (typeof node2 === 'undefined' ? 'undefined' : _typeof(node2)) || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type;
};

var updateElement = function updateElement($parent, newNode, oldNode) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (!oldNode) {
    // 添加新元素
    $parent.appendChild(createElement(newNode));
  } else if (!newNode) {
    // 移除元素
    $parent.removeChild($parent.childNodes[index]);
  } else if (changed(newNode, oldNode)) {
    // 替换元素
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
  } else if (newNode.type) {
    // 对元素的下一级进行更新
    var newLength = newNode.children.length;
    var oldLength = oldNode.children.length;
    for (var i = 0; i < newLength || i < oldLength; i++) {
      updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
    }
  }
};
/**
 * @method mount
 * @param {HTMLElement} $el
 * @param {String|HTMLElement} mount
 */
var mount = exports.mount = function mount($el, _mount) {
  var t = _mount;
  if (isString(t)) {
    t = document.querySelector(t);
  }
  if (isNode(t) && isNode($el)) {
    t.appendChild($el);
  }
  return t;
};
var old = null;
var render = function render(node) {
  if (!old) {
    old = node;
    mount(createElement(node));
  } else {
    updateElement($root, node, old);
  }
};