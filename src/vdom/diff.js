import Patch from './classes/Patch';
import VNode from './classes/VNode';
import lang from '../utils/lang';
import { throwError } from '../utils/handler';
import RenderInterface from './interface/RenderInterface';

const { isUnval, isFunction, isObject, isArray, isNull, isString, isNumber, isEmpty, deepEqual } = lang;

const vnodeTypeWarn = (key) => {
  // TODO: key校验
  if(!isString(key) && !isNumber(key)) {
    throwError(new Error(`${key} 's type is not String or Number, It's not prefered!`));
  }
}

const isVNode = obj => obj instanceof VNode;

 /**
  * 类型比较
  * @param {VNode} vnode 
  * @param {VNode} oldVnode
  * @returns {Boolean} isEqual
  */
const typeEqual = (vnode, oldVnode) => {
    return Object.is(vnode.type, oldVnode.type);
}

/**
 * 返回 vnode的key值, 不能为空
 * @param {VNode} vnode 
 * @returns {String|Number|Null} key
 */
const getVnodeKey = vnode => (isVNode(vnode) && isObject(vnode.props) && !isEmpty(vnode.props.key) ? vnode.props.key : null);

/**
 * 比较props
 * @param {Object} props 
 * @param {Object} oldProps
 * @returns {Object[]} [props, removeProps]
 */
const diffProps = (props, oldProps) => {
  if (isUnval(props) || isUnval(oldProps)) {
    return [props, oldProps];
  }
  const p = {};
  const r = {};
  const propsKs = Object.keys(props);
  const oldKs = Object.keys(oldProps);
  propsKs.forEach(k => {
    const index = oldKs.indexOf(k);
    // 新增
    if (index === -1) {
      p[k] = props[k];
      return;
    }
    // 修改
    // 如果相等跳过
    // const isEqual = Object.is(props[k], oldProps[k]);
    const isEqual = deepEqual(props[k], oldProps[k]);
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
  oldKs.forEach(ok => {
    r[ok] = oldProps[ok];
  })
  return [p, r];
}

/**
 * getRange
 * @param {Number} s 
 * @param {Number} l 
 * @returns {Function} range
 */
const getRange = (s,l) => (t,f) => isNumber(t) ? Math.min(l, Math.max(s, t)) : f;

/**
 * findIndexRangeFactory
 * @param {Array} list 
 * @param {Number} start >= 0 
 * @param {Number} end <= list.length 
 * @returns {Function} findIndexRange
 * @param {Function} callback (value, index, list) => boolean
 * @returns {Number} index if find return index else -1
 */
const findIndexRangeFactory = (list, start, end) =>{
  /**
   * findIndexRange
   * @param {Function} callback (value, index, list) => boolean
   * @returns {Number} index if find return index else -1
   */
  const li = isArray(list) ? list : [];
  const ranged = getRange(0, li.length -1);
  const findIndexRange =  callback => {
    if (isFunction(callback)) {
      const s = ranged(start, 0);
      const e = ranged(end, li.length -1);
      for(let i = s; i <= e; i++) {
        if (callback(list[i], i, list)) {
          return i;
        }
      }
    }
    return -1;
  };
  return findIndexRange;
}
/**
 * 返回findfn
 * @param {String|Number} key 
 * @returns {Function} findFn
 */
const getKeyVnodeIndex = key => v => Object.is(getVnodeKey(v), key);

/**
 * 过滤 undefined 和 null
 * @param {VNode[]} children 
 * @returns {VNode[]} list
 */
const filtChildren = children => {
  const res = [];
  children.forEach(child => {
    if(!isUnval(child)) {
      res.push(child);
    }
  });
  return res;
}

/**
 * vnodeFindIndexFactory
 * @param {VNode[]} list 
 * @param {VNode[]} oldList 
 * @param {VNode[]} nodeList
 * @param {Node} parent
 * @param {RenderInterface} render
 * @returns {Function} vnodeFindIndex
 */
const vnodeFindIndexFactory = (list, oldList, nodeList, parent, render) => {
   // TODO: 这里需要观察一下， 如果oldChildren 包含 null/undefined, 则 oldChildren 的length 将大于childNodes的length
   if (oldList.length !== nodeList.length) {
    throwError(new Error('[Diff] oldChildren 与 childNodes 不等长'));
  }
  /**
   * vnodeFindIndex
   * 从oldList 中找到第一个与 list[i] 同源的, 并生成更新
   * @param {Number} i list 当前index 
   * @param {Number} k oldList&nodeList 头指针
   * @param {Number} t oldList&nodeList 尾指针
   */
  const vnodeFindIndex = (i, k, t) => {
    const patches = [];
    const vnode = list[i];
    const isV = isVNode(vnode);
    let index = -1;
    // 是否是全相等的文本节点
    let isTextEqual = false;
    // 插入到当前node指针位置前
    const next = nodeList[k] || null;
    const findIndexRange = findIndexRangeFactory(oldList, k, t);
    // 查找 index
    if (!isV) {
      // 如果不是VNode， 直接Object.is
      index = findIndexRange(v => Object.is(v, vnode));
      if (index > -1) {
        isTextEqual = true;
      } else {
        // 当没有完全相等的text时， 查找第一个 TextNode
        index = findIndexRange(v => !isVNode(v));
      }
    } else {
      const key = getVnodeKey(vnode);
      if (isNull(key)) {
        // 不含key时, 取第一个同类型无key oldNode, 没有则新增
        index = findIndexRange(v => isNull(getVnodeKey(v)) && typeEqual(vnode, v))
      } else {
        vnodeTypeWarn(key);
        // 有key 时直接找key
        index = findIndexRange(v => Object.is(getVnodeKey(v), key));
      }
    }
    // 如果找到了
    if (index > -1) {
      // 找到oldNode 时 sort 并 diff
      // 将 oldNode 从 删除集合中移除
      const [ oldVnode ] = oldList.splice(index, 1);
      const [ node ] = nodeList.splice(index, 1);
      // 当 node === next 时 说明在最前面, 不用插入了
      if (node !== next) {
        patches.push(Patch.sort(node, parent, next));
      }
      // 当不是VNode 时是全等
      if (isV) {
        return patches.concat(diff(vnode, oldVnode, node, render));
      } else if (!isTextEqual) {
        patches.push(Patch.text(node, vnode));
      }
    } else {
      // 没找到时 直接新建一个
      patches.push(Patch.insert(vnode, parent, next));
    }
    return patches;
  };
  return vnodeFindIndex;
}

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
const vnodeEqual = (vnode, oldVnode) => {
  const isV = isVNode(vnode);
  const isVold = isVNode(oldVnode);
  if (isV && isVold) {
    const key = getVnodeKey(vnode);
    const oldKey = getVnodeKey(oldVnode);
    if (isNull(key) && isNull(oldKey)) {
      // 两个 非key Vnode 比较类型
      return typeEqual(vnode, oldVnode);
    }
    return Object.is(key, oldKey);
  }
  return !isV && !isVold;
}

/**
 * vnodeEqualDoFactory
 * @param {VNode[]} list 
 * @param {VNode[]} oldList 
 * @param {Node[]} nodeList 
 * @param {RenderInterface} render
 * @returns {Function} vnodeEqualDo
 */
const vnodeEqualDoFactory = (list, oldList, nodeList, render) => {
  /**
   * 
   * @param {Number} m list index
   * @param {Number} n oldList index
   * @returns {Object} { flag, patches }
   */
  const vnodeEqualDo = (m, n) => {
    const vnode = list[m];
    const oldVnode = oldList[n];
    const node = nodeList[n];
    const isV = isVNode(vnode);
    let ps = [];
    if (vnodeEqual(vnode, oldVnode)) {
      if(isV) {
        // 两个vnode 直接diff
        ps = diff(vnode, oldVnode, node, render);
      } else if(!Object.is(vnode, oldVnode)) {
        // 如果两个相同则不用更新， 否则text
        ps = Patch.text(node, vnode);
      }
      return  { flag: true, ps };
    }
    return { flag: false };
  };
  return vnodeEqualDo;
}
/**
 * 比较children, 新增， 删除，修改， 排序
 * old 长 t, new 长度 n  change 长度 t  复杂度 m*n
 * @param {VNode[]} children 
 * @param {VNode[]} oldChildren
 * @param {Node} parent
 * @param {RenderInterface} render
 * @returns {Patch[]} patches
 */
const diffChildrenNB = (children, oldChildren, parent, render) => {
  // 过滤undefined/null
  const list = filtChildren(children);
  const oldList = filtChildren(oldChildren);
  const nodeList = render.getChildren(parent);
  let patches = [];
  const vnodeEqualDo = vnodeEqualDoFactory(list, oldList, nodeList, render);
  const vnodeFindIndex = vnodeFindIndexFactory(list, oldList, nodeList, parent, render);
 
  let i = 0;
  let j = list.length - 1;
  let k = 0;
  let t = oldList.length - 1;
  let direction = 0; // 0:从小到大 1:从大到小
  let forceLowerFlag = false; // 打开降级强制查找 flag
  let find
  // 遍历直至children遍历完， childNodes如有剩余全部删除
  while(i <= j) {
    if (direction === 0) {
      const { flag, ps } = vnodeEqualDo(i, k);
      if(flag) {
        patches = patches.concat(ps);
        i += 1;
        k += 1;
      } else {
        direction = 1;
      }
    } else if (direction === 1 && !forceLowerFlag) {
      const { flag, ps } = vnodeEqualDo(j, t);
      if(flag) {
        patches = patches.concat(ps);
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
  return patches.concat(nodeList.slice(k, t).map(node => Patch.remove(node, parent)));
}

/**
 * 比较vnode,  产出新增， 删除， 更改， 排序， 文本
 * @param {VNode} vnode 
 * @param {VNode} oldVnode
 * @param {Node} node
 * @param {RenderInterface} render
 * @returns {Patch[]} patches
 */
const diff = (vnode, oldVnode, node, render) => {
  if(isVNode(vnode) && isVNode(oldVnode)) {
    const patches = [];
    // 先判断类型
    if (typeEqual(vnode, oldVnode)) {
        // 再判断props, 不同则创建props更新
        const props = vnode.props;
        const oldProps = oldVnode.props;
        // const isEqual = propsEqual(props, oldProps);
        const isEqual = deepEqual(props, oldProps);
        if(!isEqual) {
          patches.push(Patch.props(node, ...(diffProps(props, oldProps))));
        }
        // 遍历子节点的diff
        // return patches.concat(diffChildren(vnode.children, oldVnode.children, node, render))
        return patches.concat(diffChildrenNB(vnode.children, oldVnode.children, node, render))
    }
    // 当类型不同时直接重新渲染， TODO: 如果要重利用还需要diff props 和children 代价不明
  }
  // 当其中一者不是Vnode时，直接重新渲染
  return [
    Patch.replace(vnode, node),
  ];
}

export default diff;