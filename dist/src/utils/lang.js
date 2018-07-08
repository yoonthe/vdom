'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SymbolFactory = exports.getType = undefined;

var _constant = require('./constant');

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

var lang = _constant.ObjectTypes.reduce(function (mol, t) {
    mol['is' + t] = function (obj) {
        return getType(obj) === t;
    };
    return mol;
}, {
    getType: getType,
    SymbolFactory: SymbolFactory,
    isElement: function isElement(obj) {
        return obj instanceof Element;
    },
    isUnval: function isUnval(obj) {
        return lang.isUndefined(obj) || lang.isNull(obj);
    },
    isEmpty: function isEmpty(obj) {
        return isUnval(obj) || obj === '' || lang.isArray(obj) && obj.length === 0;
    }
});

exports.default = lang;