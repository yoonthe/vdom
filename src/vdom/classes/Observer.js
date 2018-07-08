import lang from '../../utils/lang';

const { isUndefined, isObject, isArray, isFunction, SymbolFactory, deepcopy } = lang;
const obSymbol = SymbolFactory('Observer');
const originKey = obSymbol('origin');

const needOb = obj => isObject(obj) || isArray(obj);

const ob = (obj,callback) => needOb(obj) ? new Observer(obj, callback) : obj;

const proxyHandler = callback => ({
  // get(target, key, receiver) {
  //   let val = Reflect.get(target, key, receiver);
  //   if (Observer[staticKey]) {
  //     val = Object.freeze(deepcopy(val));
  //   }
  //   return val ;
  // },
  set(target, key, value, receiver) {
    // TODO: 回调
    if (isFunction(callback)) callback({ target, key, value, receiver });
    target[originKey][key] = value;
    return Reflect.set(target, key, ob(value, callback), receiver);
  },
});

export default class Observer {
  /**
   * @constructor
   * @param {Object|Array} state 
   * @param {Function} callback 
   */
  constructor(state, callback) {
    this[originKey] = state;
    if (isObject(state)) {
      Object.keys(state).forEach(key => {
        this[key] = ob(state[key], callback);
      })
    }
    if (isArray(state)) {
      return new ArrayObserver(state, callback);
    }
    return new Proxy(this, proxyHandler(callback));
  }
  getStatic() {
    return Object.freeze(deepcopy(this[originKey]))
  }
}

export const ArrayObserver = class ArrayObserver extends Array {
  constructor(state, callback) {
    super();
    this[originKey] = state;
    state.forEach(t => {
      this.push(ob(t, callback));
    });
    return new Proxy(this, proxyHandler(callback));
  }
  getStatic() {
    return Object.freeze(deepcopy(this[originKey]))
  }
}

Observer.ArrayObserver = ArrayObserver;
