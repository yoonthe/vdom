import { isUndefined, isObject, isFunction } from 'lodash';
const stateKey = Symbol('Observer#state');
export default class Observer {
  constructor(state, callback) {
    if (isObject(state) && !isFunction(state)) {
      this[stateKey] = state;
      return new Proxy(this, {
        get(target, key, receiver) {
          if ( key === stateKey) {
            return this[stateKey];
          }
          let val = Reflect.get(target[stateKey], key, receiver);
          if(isObject(val) && !isFunction(val) && !(val instanceof Observer)) {
            val = new Observer(val, callback);
            target[stateKey][key] = val;
            // Reflect.set(target[stateKey], key, val, receiver)
          }
          return val ;
        },
        set(target, key, value, receiver) {
          // TODO: 回调
          let val = value;
          if (isFunction(callback)) callback();
          if(isObject(val) && !isFunction(val)) {
            val = new Observer(val, callback);
          }
          target[stateKey][key] = val;
          return true;
          // return Reflect.set(target[stateKey], key, val, receiver);
        },
      });
    }
    return state;
  }
}