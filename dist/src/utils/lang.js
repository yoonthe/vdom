'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.flatten = exports.deepEqual = exports.deepcopy = exports.SymbolFactory = exports.getType = undefined;

var _constant = require('./constant');

/**
 * 获取 type  首字母大写
 * @param {*} obj 
 * @returns {String} type 'Object', 'Array', 'Function', 'Symbol', 'Number', 'String', 'Boolean', 'Undefined','Null','Date', 'RegExp'
 */
var getType = exports.getType = function getType(obj) {
    return toString.call(obj).replace(/\[object ([^\]]+)\]/, function (t, t1) {
        return t1;
    });
};

var SymbolFactory = exports.SymbolFactory = function SymbolFactory(title) {
    var getable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return function (desc) {
        var get = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return getable || get ? Symbol.for(title + '#' + desc) : Symbol(title + '#' + desc);
    };
};

/**
 * 深拷贝
 * @param {*} obj 
 * @returns {*} objCopy
 */
var deepcopy = exports.deepcopy = function deepcopy(obj) {
    if (lang.isObject(obj)) {
        var t = {};
        Object.keys(obj).forEach(function (k) {
            return t[k] = deepcopy(obj[k]);
        });
        return t;
    }
    if (lang.isArray(obj)) {
        return obj.map(function (t) {
            return deepcopy(t);
        });
    }
    return obj;
};

/**
 * 深比较
 * @param {*} obj 
 * @param {*} cmp 
 * @returns {Boolean} isEqual
 */
var deepEqual = exports.deepEqual = function deepEqual(obj, cmp) {
    // 类型不同不用比了
    if (getType(obj) !== getType(cmp)) return false;
    if (lang.isObject(obj) && lang.isObject(cmp)) {
        var ks = Object.keys(obj);
        return deepEqual(ks, Object.keys(cmp)) && ks.findIndex(function (k) {
            return !deepEqual(obj[k], cmp[k]);
        }) === -1;
    }
    if (lang.isArray(obj) && lang.isArray(cmp)) {
        return obj.length === cmp.length && obj.findIndex(function (t, i) {
            return !deepEqual(t, cmp[i]);
        }) === -1;
    }
    return Object.is(obj, cmp);
};

/**
 * 解除一层 []
 * @param {Array} arr 
 */
var flatten = exports.flatten = function flatten(arr) {
    return lang.isArray(arr) ? arr.reduce(function (mol, t) {
        return mol.concat(t);
    }, []) : [];
};

var lang = _constant.ObjectTypes.reduce(function (mol, t) {
    mol['is' + t] = function (obj) {
        return getType(obj) === t;
    };
    return mol;
}, {
    getType: getType,
    SymbolFactory: SymbolFactory,
    deepcopy: deepcopy,
    deepEqual: deepEqual,
    flatten: flatten,
    isNode: function isNode(obj) {
        return obj instanceof Node;
    },
    isUnval: function isUnval(obj) {
        return lang.isUndefined(obj) || lang.isNull(obj);
    },
    isEmpty: function isEmpty(obj) {
        return lang.isUnval(obj) || obj === '' || lang.isArray(obj) && obj.length === 0 || Object.is(obj, NaN);
    }
});

exports.default = lang;