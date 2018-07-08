import Observer from './Observer';
import Patch from './Patch';
import lang from '../../utils/lang';
import { getRender, isDebug } from '../config';
import { throwError, handleErrors } from '../../utils/handler';
import diff from '../diff';

const { SymbolFactory, isFunction, isNull } = lang;

const symbol = SymbolFactory('Model');

// 输入options
const optionsKey = symbol('options');
// 上一次vnode结构
const oldVNode = symbol('oldVNode');
// 上一次渲染结果
const oldNode = symbol('oldNode');
// 最后一次vnode结构
const vnode = symbol('vnode');
// 最后一次渲染结果
const node = symbol('node');
// 最近的patch集合
const patches = symbol('patches');
// 绑定位置
const mountNode = symbol('mountNode');
// 渲染器
const Render = symbol('Render');
// model 状态 响应式
const stateKey = symbol('state');
// model 状态 getter 静态化 flag
const staticStateFlag = symbol('staticStateFlag');
// 初始化方法
const initFn = symbol('initFn');
// 更新方法
const applyFn = symbol('applyFn');
// 更新实际操作方法
const updateFn = symbol('updateFn');
// 实际render方法
const renderFn = symbol('renderFn');
// 更新promise
const updatePromiseKey = symbol('updatePromise');
// 渲染更新方法
// const dispatchFn = symbol('dispatchFn');
// 渲染更新实际方法
const patchFn = symbol('patchFn');


export default class Model {
  constructor(options) {
    if(!isFunction(options.render)) {
      throw new Error('Model must get a [render] function!');
    }
    this[optionsKey] = {state: options.state || {}, ...options};
    this[updatePromiseKey] = null;
    this[oldVNode] = null;
    this[oldNode] = null;
    this[patches] = [];
    this[mountNode] = null;
    this[staticStateFlag] = false;
    // 开始初始化
    Promise.resolve().then(() => this[initFn]());
  }
  get state() {
    if(this[staticStateFlag]) {
      return this[stateKey].getStatic();
    } else {
      return this[stateKey];
    }
  }
  set state(state) {
    // 监听state
    this[stateKey] = new Observer(state, ()=> {
      this[applyFn]();
    });
    this[applyFn]();
  }
  [initFn]() {
    const { state, render, mount, ...args } = this[optionsKey]
    // 获取render
    this[Render] = getRender();
    const RenderInstance = this[Render];
    Patch.setRender(RenderInstance);
    // 分发props
    Object.keys(args).forEach(argKey => {
      const val = args[argKey];
      if(isFunction(val)) {
        this[argKey] = val.bind(this);
      } else {
        this[argKey] = val;
      }
    });
    // 监听state
    this[stateKey] = new Observer(state, ()=> {
      this[applyFn]();
    });
    // updateFn, patchFn绑定
    this[updateFn] = this[updateFn].bind(this);
    this[patchFn] = this[patchFn].bind(this);
    
    // 初始化渲染
    // 渲染vnode
    this[vnode] = this[renderFn]();
    // 生成实际元素
    this[node] = RenderInstance.create(this[vnode]);
    // 挂载元素
    this[mountNode] = RenderInstance.mount(this[node], mount);
    // 解析异常
    handleErrors();
  } 
  [applyFn]() {
    if(isNull(this[updatePromiseKey])) {
      this[updatePromiseKey] = Promise.resolve().then(this[updateFn]);
    }
  }
  [updateFn]() {
    if(isDebug()) {
      console.log('begin update!');
    }
    // 将上次结果变更
    this[oldVNode] = this[vnode];
    this[oldNode] = this[node];
    this[patches] = [];
    // 渲染vnode
    this[vnode] = this[renderFn]();
    // 产生变更
    this[patches] = diff(this[vnode], this[oldVNode], this[oldNode], this[Render]);

    // 同步更新
    this[patchFn]();
    
    // 解析异常
    handleErrors();
    // 清除更新
    this[updatePromiseKey] = null;
  }
  // [dispatchFn]() {
  //   Promise.resolve().then(this[patchFn])
  // }
  [patchFn]() {
    this[patches].forEach(patch => {
      if (isFunction(patch.apply)) {
        patch.apply();
      }
    })
  }
  [renderFn]() {
    this[staticStateFlag] = true;
    try {
      const res = this[optionsKey].render.call(this);
      return res;
    } catch (err) {
      throwError(err);
    } finally {
      this[staticStateFlag] = false;
    }
  }
}