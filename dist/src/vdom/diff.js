'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Patch = require('./classes/Patch');

var _Patch2 = _interopRequireDefault(_Patch);

var _VNode = require('./classes/VNode');

var _VNode2 = _interopRequireDefault(_VNode);

var _lang = require('../utils/lang');

var _lang2 = _interopRequireDefault(_lang);

var _handler = require('../utils/handler');

var _RenderInterface = require('./interface/RenderInterface');

var _RenderInterface2 = _interopRequireDefault(_RenderInterface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isUnval = _lang2.default.isUnval,
    isFunction = _lang2.default.isFunction,
    isObject = _lang2.default.isObject,
    isArray = _lang2.default.isArray,
    isNull = _lang2.default.isNull,
    isString = _lang2.default.isString,
    isNumber = _lang2.default.isNumber,
    isEmpty = _lang2.default.isEmpty,
    deepEqual = _lang2.default.deepEqual;


var vnodeTypeWarn = function vnodeTypeWarn(key) {
  // TODO: key校验
  if (!isString(key) && !isNumber(key)) {
    (0, _handler.throwError)(new Error(key + ' \'s type is not String or Number, It\'s not prefered!'));
  }
};

var isVNode = function isVNode(obj) {
  return obj instanceof _VNode2.default;
};

/**
 * 类型比较
 * @param {VNode} vnode 
 * @param {VNode} oldVnode
 * @returns {Boolean} isEqual
 */
var typeEqual = function typeEqual(vnode, oldVnode) {
  return Object.is(vnode.type, oldVnode.type);
};

/**
 * 返回 vnode的key值, 不能为空
 * @param {VNode} vnode 
 * @returns {String|Number|Null} key
 */
var getVnodeKey = function getVnodeKey(vnode) {
  return isVNode(vnode) && isObject(vnode.props) && !isEmpty(vnode.props.key) ? vnode.props.key : null;
};

/**
 * 比较props
 * @param {Object} props 
 * @param {Object} oldProps
 * @returns {Object[]} [props, removeProps]
 */
var diffProps = function diffProps(props, oldProps) {
  if (isUnval(props) || isUnval(oldProps)) {
    return [props, oldProps];
  }
  var p = {};
  var r = {};
  var propsKs = Object.keys(props);
  var oldKs = Object.keys(oldProps);
  propsKs.forEach(function (k) {
    var index = oldKs.indexOf(k);
    // 新增
    if (index === -1) {
      p[k] = props[k];
      return;
    }
    // 修改
    // 如果相等跳过
    // const isEqual = Object.is(props[k], oldProps[k]);
    var isEqual = deepEqual(props[k], oldProps[k]);
    if (!isEqual) {
      // 不是function时不需要移除，直接更新即可， 是function时， 加入removeProps
      if (isFunction(oldProps[k])) {
        r[k] = oldProps[k];
      }
      p[k] = props[k];
    }
    // oldKs 移除该元素, 说明该元素依然存在
    oldKs.splice(index, 1);
  });
  // 移除旧元素
  oldKs.forEach(function (ok) {
    r[ok] = oldProps[ok];
  });
  return [p, r];
};

/**
 * getRange
 * @param {Number} s 
 * @param {Number} l 
 * @returns {Function} range
 */
var getRange = function getRange(s, l) {
  return function (t, f) {
    return isNumber(t) ? Math.min(l, Math.max(s, t)) : f;
  };
};

/**
 * findIndexRangeFactory
 * @param {Array} list 
 * @param {Number} start >= 0 
 * @param {Number} end <= list.length 
 * @returns {Function} findIndexRange
 * @param {Function} callback (value, index, list) => boolean
 * @returns {Number} index if find return index else -1
 */
var findIndexRangeFactory = function findIndexRangeFactory(list, start, end) {
  /**
   * findIndexRange
   * @param {Function} callback (value, index, list) => boolean
   * @returns {Number} index if find return index else -1
   */
  var li = isArray(list) ? list : [];
  var ranged = getRange(0, li.length - 1);
  var findIndexRange = function findIndexRange(callback) {
    if (isFunction(callback)) {
      var s = ranged(start, 0);
      var e = ranged(end, li.length - 1);
      for (var i = s; i <= e; i++) {
        if (callback(list[i], i, list)) {
          return i;
        }
      }
    }
    return -1;
  };
  return findIndexRange;
};
/**
 * 返回findfn
 * @param {String|Number} key 
 * @returns {Function} findFn
 */
var getKeyVnodeIndex = function getKeyVnodeIndex(key) {
  return function (v) {
    return Object.is(getVnodeKey(v), key);
  };
};

/**
 * 过滤 undefined 和 null
 * @param {VNode[]} children 
 * @returns {VNode[]} list
 */
var filtChildren = function filtChildren(children) {
  var res = [];
  children.forEach(function (child) {
    if (!isUnval(child)) {
      res.push(child);
    }
  });
  return res;
};

/**
 * vnodeFindIndexFactory
 * @param {VNode[]} list 
 * @param {VNode[]} oldList 
 * @param {VNode[]} nodeList
 * @param {Node} parent
 * @param {RenderInterface} render
 * @returns {Function} vnodeFindIndex
 */
var vnodeFindIndexFactory = function vnodeFindIndexFactory(list, oldList, nodeList, parent, render) {
  // TODO: 这里需要观察一下， 如果oldChildren 包含 null/undefined, 则 oldChildren 的length 将大于childNodes的length
  if (oldList.length !== nodeList.length) {
    (0, _handler.throwError)(new Error('[Diff] oldChildren 与 childNodes 不等长'));
  }
  /**
   * vnodeFindIndex
   * 从oldList 中找到第一个与 list[i] 同源的, 并生成更新
   * @param {Number} i list 当前index 
   * @param {Number} k oldList&nodeList 头指针
   * @param {Number} t oldList&nodeList 尾指针
   */
  var vnodeFindIndex = function vnodeFindIndex(i, k, t) {
    var patches = [];
    var vnode = list[i];
    var isV = isVNode(vnode);
    var index = -1;
    // 是否是全相等的文本节点
    var isTextEqual = false;
    // 插入到当前node指针位置前
    var next = nodeList[k] || null;
    var findIndexRange = findIndexRangeFactory(oldList, k, t);
    // 查找 index
    if (!isV) {
      // 如果不是VNode， 直接Object.is
      index = findIndexRange(function (v) {
        return Object.is(v, vnode);
      });
      if (index > -1) {
        isTextEqual = true;
      } else {
        // 当没有完全相等的text时， 查找第一个 TextNode
        index = findIndexRange(function (v) {
          return !isVNode(v);
        });
      }
    } else {
      var key = getVnodeKey(vnode);
      if (isNull(key)) {
        // 不含key时, 取第一个同类型无key oldNode, 没有则新增
        index = findIndexRange(function (v) {
          return isNull(getVnodeKey(v)) && typeEqual(vnode, v);
        });
      } else {
        vnodeTypeWarn(key);
        // 有key 时直接找key
        index = findIndexRange(function (v) {
          return Object.is(getVnodeKey(v), key);
        });
      }
    }
    // 如果找到了
    if (index > -1) {
      // 找到oldNode 时 sort 并 diff
      // 将 oldNode 从 删除集合中移除
      var _oldList$splice = oldList.splice(index, 1),
          _oldList$splice2 = _slicedToArray(_oldList$splice, 1),
          oldVnode = _oldList$splice2[0];

      var _nodeList$splice = nodeList.splice(index, 1),
          _nodeList$splice2 = _slicedToArray(_nodeList$splice, 1),
          node = _nodeList$splice2[0];
      // 当 node === next 时 说明在最前面, 不用插入了


      if (node !== next) {
        patches.push(_Patch2.default.sort(node, parent, next));
      }
      // 当不是VNode 时是全等
      if (isV) {
        return patches.concat(diff(vnode, oldVnode, node, render));
      } else if (!isTextEqual) {
        patches.push(_Patch2.default.text(node, vnode));
      }
    } else {
      // 没找到时 直接新建一个
      patches.push(_Patch2.default.insert(vnode, parent, next));
    }
    return patches;
  };
  return vnodeFindIndex;
};

// /**
//  * 比较children, 新增， 删除，修改， 排序
//  * old 长 m, new 长度 n change 长度 t  复杂度 m*n
//  * @param {VNode[]} children 
//  * @param {VNode[]} oldChildren
//  * @param {Node} parent
//  * @param {RenderInterface} render
//  * @returns {Patch[]} patches
//  */
// const diffChildren = (children, oldChildren, parent, render) => {
//   // 过滤undefined/null
//   const list = filtChildren(children);
//   const oldList = filtChildren(oldChildren);
//   const nodeList = render.getChildren(parent);
//   let patches = [];
//   const vnodeFindIndex = vnodeFindIndexFactory(list, oldList, nodeList, parent, render);
//   let i = 0;
//   // 遍历直至children遍历完， childNodes如有剩余全部删除
//   while(i < list.length) {
//     patches = patches.concat(vnodeFindIndex(i, 0));
//     i += 1;
//   }
//   // old剩余全部删除
//   return patches.concat(nodeList.map(node => Patch.remove(node, parent)));
// }
/**
 * 判断 两个 vnode 是否同源 ()
 * @param {VNode} vnode 
 * @param {VNode} oldVnode 
 * @returns {Boolean} isEqual
 */
var vnodeEqual = function vnodeEqual(vnode, oldVnode) {
  var isV = isVNode(vnode);
  var isVold = isVNode(oldVnode);
  if (isV && isVold) {
    var key = getVnodeKey(vnode);
    var oldKey = getVnodeKey(oldVnode);
    if (isNull(key) && isNull(oldKey)) {
      // 两个 非key Vnode 比较类型
      return typeEqual(vnode, oldVnode);
    }
    return Object.is(key, oldKey);
  }
  return !isV && !isVold;
};

/**
 * vnodeEqualDoFactory
 * @param {VNode[]} list 
 * @param {VNode[]} oldList 
 * @param {Node[]} nodeList 
 * @param {RenderInterface} render
 * @returns {Function} vnodeEqualDo
 */
var vnodeEqualDoFactory = function vnodeEqualDoFactory(list, oldList, nodeList, render) {
  /**
   * 
   * @param {Number} m list index
   * @param {Number} n oldList index
   * @returns {Object} { flag, patches }
   */
  var vnodeEqualDo = function vnodeEqualDo(m, n) {
    var vnode = list[m];
    var oldVnode = oldList[n];
    var node = nodeList[n];
    var isV = isVNode(vnode);
    var ps = [];
    if (vnodeEqual(vnode, oldVnode)) {
      if (isV) {
        // 两个vnode 直接diff
        ps = diff(vnode, oldVnode, node, render);
      } else if (!Object.is(vnode, oldVnode)) {
        // 如果两个相同则不用更新， 否则text
        ps = _Patch2.default.text(node, vnode);
      }
      return { flag: true, ps: ps };
    }
    return { flag: false };
  };
  return vnodeEqualDo;
};
/**
 * 比较children, 新增， 删除，修改， 排序
 * old 长 t, new 长度 n  change 长度 t  复杂度 m*n
 * @param {VNode[]} children 
 * @param {VNode[]} oldChildren
 * @param {Node} parent
 * @param {RenderInterface} render
 * @returns {Patch[]} patches
 */
var diffChildrenNB = function diffChildrenNB(children, oldChildren, parent, render) {
  // 过滤undefined/null
  var list = filtChildren(children);
  var oldList = filtChildren(oldChildren);
  var nodeList = render.getChildren(parent);
  var patches = [];
  var vnodeEqualDo = vnodeEqualDoFactory(list, oldList, nodeList, render);
  var vnodeFindIndex = vnodeFindIndexFactory(list, oldList, nodeList, parent, render);

  var i = 0;
  var j = list.length - 1;
  var k = 0;
  var t = oldList.length - 1;
  var direction = 0; // 0:从小到大 1:从大到小
  var forceLowerFlag = false; // 打开降级强制查找 flag
  var find = void 0;
  // 遍历直至children遍历完， childNodes如有剩余全部删除
  while (i <= j) {
    if (direction === 0) {
      var _vnodeEqualDo = vnodeEqualDo(i, k),
          flag = _vnodeEqualDo.flag,
          ps = _vnodeEqualDo.ps;

      if (flag) {
        patches = patches.concat(ps);
        i += 1;
        k += 1;
      } else {
        direction = 1;
      }
    } else if (direction === 1 && !forceLowerFlag) {
      var _vnodeEqualDo2 = vnodeEqualDo(j, t),
          _flag = _vnodeEqualDo2.flag,
          _ps = _vnodeEqualDo2.ps;

      if (_flag) {
        patches = patches.concat(_ps);
        j -= 1;
        t -= 1;
      } else {
        forceLowerFlag = true;
      }
    } else if (direction === 1 && forceLowerFlag) {
      // 当前后都不相等时， 降级查找 list[i], 之后取消从后查找
      patches = patches.concat(vnodeFindIndex(i, k, t));
      i += 1;
      direction = 0;
    }
  }
  // old 未遍历的全部删除
  return patches.concat(nodeList.slice(k, t).map(function (node) {
    return _Patch2.default.remove(node, parent);
  }));
};

/**
 * 比较vnode,  产出新增， 删除， 更改， 排序， 文本
 * @param {VNode} vnode 
 * @param {VNode} oldVnode
 * @param {Node} node
 * @param {RenderInterface} render
 * @returns {Patch[]} patches
 */
var diff = function diff(vnode, oldVnode, node, render) {
  if (isVNode(vnode) && isVNode(oldVnode)) {
    var patches = [];
    // 先判断类型
    if (typeEqual(vnode, oldVnode)) {
      // 再判断props, 不同则创建props更新
      var props = vnode.props;
      var oldProps = oldVnode.props;
      // const isEqual = propsEqual(props, oldProps);
      var isEqual = deepEqual(props, oldProps);
      if (!isEqual) {
        patches.push(_Patch2.default.props.apply(_Patch2.default, [node].concat(_toConsumableArray(diffProps(props, oldProps)))));
      }
      // 遍历子节点的diff
      // return patches.concat(diffChildren(vnode.children, oldVnode.children, node, render))
      return patches.concat(diffChildrenNB(vnode.children, oldVnode.children, node, render));
    }
    // 当类型不同时直接重新渲染， TODO: 如果要重利用还需要diff props 和children 代价不明
  }
  // 当其中一者不是Vnode时，直接重新渲染
  return [_Patch2.default.replace(vnode, node)];
};

exports.default = diff;