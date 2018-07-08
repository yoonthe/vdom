'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mount = exports.createElement = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lang = require('../utils/lang');

var _lang2 = _interopRequireDefault(_lang);

var _handler = require('../utils/handler');

var _VNode = require('../vdom/classes/VNode');

var _VNode2 = _interopRequireDefault(_VNode);

var _constant = require('./constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isFunction = _lang2.default.isFunction,
    isArray = _lang2.default.isArray,
    isObject = _lang2.default.isObject,
    isUnval = _lang2.default.isUnval,
    isString = _lang2.default.isString,
    isElement = _lang2.default.isElement,
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
  return toString.call(obj);
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
      if (element instanceof Node) {
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
// const eventWrapper = (target, event, listener, options) => {

// }
/**
 * setProps
 * @param {HTMLElement} node 
 * @param {Object} props 
 * @param {Object} oldProps
 */
var setProps = function setProps(node, props, oldProps) {
  if (isUnval(props)) {
    return;
  }
  var ks = Object.keys(props);
  ks.forEach(function (key) {
    var val = props[key];
    if (isFunction(val)) {
      var execProp = eventPropRegExp.exec(key);
      if (!isNull(execProp)) {
        var eventName = execProp[1].toLowerCase();
        if (_constant.AllEvents.indexOf(eventName) > -1) {
          var _options = passiveSupported ? convertOption(execProp[2].slice(1).split('_')) : execProp[2].indexOf('capture') > -1;
          node.addEventListener(eventName, val, _options);
          return;
        } else {
          return (0, _handler.throwError)(new Error('Eventname ' + eventName + ' is\'t corrected or not be supported!'));
        }
      } else {
        return (0, _handler.throwError)(new Error('EventListener\'s key can\'t be formated! Check the ' + key + '.'));
      }
    }
    switch (key) {
      // case 'className': 
      default:
        node.setAttribute(key, formatProp(props[key]));
    }
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
  if (isElement(t) && isElement($el)) {
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