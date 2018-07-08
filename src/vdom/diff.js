import Patch from './classes/Patch';
import VNode from './classes/VNode';
import lang from '../utils/lang';
import { throwError } from '../utils/handler';
import RenderInterface from './interface/RenderInterface';

const { isUnval, isFunction, isObject, isNull, isString, isNumber, deepEqual } = lang;

const isVNode = obj => obj instanceof VNode;

 /**
  * 类型比较
  * @param {VNode} vnode 
  * @param {VNode} oldVNode
  * @returns {Boolean} isEqual
  */
const typeEqual = (vnode, oldVnode) => {
    return Object.is(vnode.type, oldVnode.type);
}

   
/**
 * 比较props, 因为props 之内不应该总是替换对象， 因此比较是单层的
 * @param {Object} props 
 * @param {Object} oldProps
 * @returns {Boolean} isEqual
 */
// const propsEqual = (props, oldProps) => {
//   if(isUnval(props) && isUnval(oldProps)) {
//     return true;
//   }
//   if(isObject(props) && isObject(oldProps)) {
//     const propsKs = Object.keys(props);
//     const oldKs = Object.keys(oldProps);
//     return Object.is(propsKs.length, oldKs.length) && !propsKs.find((k1,index) => !Object.is(k1, oldKs[index]))
//       && !propsKs.find(k2 => !Object.is(props[k2],oldProps[k2]));
//   }
//   return false;
// };

/**
 * 返回 vnode的key值
 * @param {VNode} vnode 
 * @returns {String|Null} key
 */
const getVnodeKey = vnode => isVNode(vnode) && isObject(vnode.props) ? vnode.props.key || null : null;

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
 * 在 vnodes 中找到 第一个类型为 type 无key的vnode
 * @param {VNode[]} vnodes 
 * @param {String} type 
 * @returns {Number} index
 */
const getNoKeyVnodeIndexByType = (vnodes, type) => vnodes.findIndex(v => isNull(getVnodeKey(v)) && Object.is(v.type, type));
/**
 * 在 vnodes 中找到 第一个类型为 type 无key的vnode
 * @param {VNode[]} vnodes 
 * @param {String|Number} key 
 * @returns {Number} index
 */
const getKeyVnodeIndex = (vnodes, key) => vnodes.findIndex(v => Object.is(getVnodeKey(v), key));

/**
 * 在 vnodes 中找到 第一个全相等的index
 * @param {VNode[]} vnodes 
 * @param {*} value
 * @returns {Number} index
 */
const getValueIndex = (vnodes, value) => vnodes.findIndex(v => Object.is(v, value));

/**
 * 在 vnodes 中找到 第一个 非VNode的index
 * @param {VNode[]} vnodes 
 * @returns {Number} index
 */
const getTextIndex = (vnodes) => vnodes.findIndex(v => !isVNode(v));

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
 * 比较children, 新增， 删除， 排序
 * @param {VNode[]} children 
 * @param {VNode[]} oldChildren
 * @param {Node} parent
 * @param {RenderInterface} render
 * @returns {Patch[]} patches
 */
const diffChildren = (children, oldChildren, parent, render) => {
  // 新增， 删除， 排序
  // 重新包一个数组方便删除
  // const oldList = [...oldChildren];
  const list = filtChildren(children);
  const oldList = filtChildren(oldChildren);
  const delList = [...(render.getChildren(parent))];
  // // 未匹配 vnode 
  // const wantList = {
  //   key: [],
  //   type: [],
  // };
  // // 未匹配oldVnode
  // const remainList = {
  //   key: [],
  //   type: [],
  // };
  // TODO: 这里需要观察一下， 如果oldChildren 包含 null/undefined, 则 oldChildren 的length 将大于childNodes的length
  if (oldList.length !== delList.length) {
    console.error('[Diff] oldChildren 与 childNodes 不等长');
  }
  let patches = [];
  let i = 0;
  // let j = 0;
  let k = 0;
  // 遍历直至children遍历完， childNodes如有剩余全部删除
  while(i < list.length) {
    const vnode = list[i];
    const isV = isVNode(vnode);
    let index = -1;
    // 是否是全相等的文本节点
    let isTextEqual = false;
    // 如果不是VNode， 直接Object.is
    if (!isV) {
      index = getValueIndex(oldList, vnode);
      if (index > -1) {
        isTextEqual = true;
      } else {
        index = getTextIndex(oldList);
      }
    } else {
      const key = getVnodeKey(vnode);
      if (isNull(key)) {
        // 不含key时, 取第一个同类型无key oldNode, 没有则新增
        index = getNoKeyVnodeIndexByType(oldList, vnode.type);
      } else {
        // 有key 时直接找key
        if(!isString(key) && !isNumber(key)) {
          throwError(new Error(`${key} 's type is not String or Number, It's not prefered!`));
        }
        index = getKeyVnodeIndex(oldList, key);
      }
    }
    // 插入到当前node指针位置前
    const next = delList[k];
    if (index > -1) {
      // 找到oldNode 时 insert 并 diff
      // 将 oldNode 从 删除集合中移除
      const [ oldVnode ] = oldList.splice(index, 1);
      const [ node ] = delList.splice(index, 1);
      // 当 node === next 时 说明在最前面, 不用插入了
      if (node !== next) {
        patches.push(Patch.insert(node, parent, next));
      }
      // 当不是VNode 时是全等
      if (isV) {
        patches = patches.concat(diff(vnode, oldVnode, node, render));
      } else if (!isTextEqual) {
        patches.push(Patch.text(node, vnode));
      }
    } else {
      // 没找到时 直接新建一个
      patches.push(Patch.insert(vnode, parent, next));
    }
    i += 1;
    continue;
  }
  // old剩余全部删除
  return patches.concat(delList.map(node => Patch.remove(node, parent)));
}

/**
 * 比较children, 新增， 删除， 排序
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
        return patches.concat(diffChildren(vnode.children, oldVnode.children, node, render))
    }
    // 当类型不同时直接重新渲染， TODO: 如果要重利用还需要diff props 和children 代价不明
  }
  // 当其中一者不是Vnode时，直接重新渲染
  return [
    Patch.replace(vnode, node),
  ];
}

export default diff;