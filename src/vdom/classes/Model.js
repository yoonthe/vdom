import { isFunction } from 'lodash';
import Observer from './Observer';
import { SymbolFactory } from '../../utils/lang';
import { getRender } from '../config';

const symbol = SymbolFactory('Model');

const State= symbol('State');
const last = symbol('last');
const node = symbol('node');
const Mount = symbol('Mount');
const mountNode = symbol('mountNode');
const init = symbol('init');
const Render = symbol('Render');
const apply = symbol('apply');
const update = symbol('update');


export default class Model {
  constructor({ state = {}, mount, render, ...args }) {
    this[State] = state;
    this[Mount] = mount;
    this.render = render;
    if(!isFunction(this.render)) {
      throw new Error('Model must get a [render] function!');
    }
    this[last] = null;
    this[mountNode] = null;
    this[Render] = getRender();
    
    // 合并props
    Object.keys(args).forEach(k => {
      if(isFunction(args[k])) {
        this[k] = args[k].bind(this);
        return;
      }
      this[k] = args[k];
    });

    // 开始初始化
    Promise.resolve().then(() => this[init]());
  }
  [init]() {
    const render = this[Render];
    // 监听state
    this.state = new Observer(this[State], ()=> {
      this[apply]();
    });
    // 渲染vnode
    this[node] = render.create(this.render());
    // mountNode
    this[mountNode] = render.mount(this[node], this[Mount]);
  } 
  [apply]() {
    Promise.resolve().then(() => this[update]());
  }
  [update]() {
    console.log('begin update!');
  }
}