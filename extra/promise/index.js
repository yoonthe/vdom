
const status = Symbol('Promise#status');
const pending = 'pending';
const fulfilled = 'fulfilled';
const rejected = 'rejected';
// pending, fulfilled, rejected
const value = Symbol('Promise#value');
const promiseListenerMap = new WeakMap();

const noop = v => v;
const getFn = fn => typeof fn === 'function' ? fn : noop;
const promiseCallFactory = (resolve, reject, call) => {
  return arg => {
    try {
      resolve(call(arg));
    } catch (err) {
      reject(err);
    }
  };
};
const promiseServe = (promise, isRejected = false) => {
  setTimeout(() => {
    const arr = promiseListenerMap.get(promise) || [];
    for (const t of arr) {
      if (isRejected) {
        // onReject
        const { onRejected } = t;
        if (typeof onRejected === 'function') {
          onRejected(promise[value]);
        } else {
          throw new Error(`Uncatched Promise Rejected! ${promise[value]}`);
        }
      } else {
        const { onResolved } = t;
        if (typeof onResolved === 'function') {
          onResolved(promise[value]);
        }
      }
    }
    promiseListenerMap.delete(promise);
  }, 0);
};
const promiseCheck = (promise, onResolved, onRejected) => {
  if (promise[status] === fulfilled || promise[status] === rejected) {
    (promise[status] === fulfilled ? onResolved : onRejected)(promise[value]);
  } else {
    promiseListenerMap.set(promise, (promiseListenerMap.get(promise) || []).concat({ onResolved, onRejected}));
  }
};
/**
 * PromisePolyfill
 * @constructor
 * @param {Function} executor (resolve, reject) => null
 */
const PromisePolyfill = function(executor) {
  this[status] = pending;
  this[value] = null;
  const reject = err => {
    if (this[status] === pending) {
      this[status] = rejected;
      this[value] = err;
      promiseServe(this, true);
    }
  };
  const resolve = val => {
    if (this[status] === pending) {
      if (val instanceof PromisePolyfill) {
        val.then(resolve, reject);
      } else {
        this[status] = fulfilled;
        this[value] = val;
        promiseServe(this);
      }
    }
  }
  try {
    executor(resolve, reject);
  } catch (err) {
    reject(err);
  }
}

PromisePolyfill.prototype.then = function (onFulFilled, onRejected) {
  return new PromisePolyfill((resolve, reject) => {
    promiseCheck(this, promiseCallFactory(resolve, reject, getFn(onFulFilled)),
    typeof onRejected === 'function' ? promiseCallFactory(resolve, reject, onRejected) : e => reject(e))
  })
};

PromisePolyfill.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};

PromisePolyfill.prototype.finally = function (onFinally) {
  return this.then(onFinally, onFinally);
};

PromisePolyfill.resolve = value => {
  if (value instanceof PromisePolyfill) {
    return value;
  }
  // thenable
  if (typeof value.then === 'function') {
    return new PromisePolyfill((resolve, reject) => {
      try {
        value.then(resolve, reject);
      } catch (err) {
        reject(err);
      }
    })
  }
  return new PromisePolyfill(resolve => resolve(value));
};

PromisePolyfill.reject = reason => {
  return new PromisePolyfill((r, reject) => reject(reason));
};

const getLength = iterable => {
  let length = 0
  for (let i of iterable) {
    length += 1;
  }
  return length;
};

PromisePolyfill.all = iterable => {
  try {
    const length = iterable.length || getLength(iterable);
    if (length === 0) {
      return PromisePolyfill.resolve();
    }
    return new PromisePolyfill((resolve, reject) => {
      const values = new Array(length);
      let resolveSize = 0;
      const resolveIn = index => val => {
        values[index] = val;
        resolveSize += 1;
        if (resolveSize === length) {
          resolve(values);
        }
      };
      let i = 0;
      for (promise of iterable) {
        promise.then(resolveIn(i), reject);
        i += 1;
      }
    })
  } catch (err) {
    return PromisePolyfill.reject(err);
  }
};

PromisePolyfill.race = iterable => {
  try {
    const length = iterable.length || getLength(iterable);
    if (length === 0) {
      return PromisePolyfill.resolve();
    }
    return new PromisePolyfill((resolve, reject) => {
      for (promise of iterable) {
        promise.then(resolve, reject);
      }
    })
  } catch (err) {
    return PromisePolyfill.reject(err);
  }
};

module.exports = PromisePolyfill;