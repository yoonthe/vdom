"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var errors = [];
var throwError = exports.throwError = function throwError(err) {
    if (err instanceof Error) {
        errors.push(err);
    }
};

var handleError = exports.handleError = function handleError() {
    var handler = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultHandler;

    errors.forEach(function (err) {
        return handler(err);
    });
    errors.splice(0, errors.length);
};

var defaultHandler = function defaultHandler(err) {
    console.errror(err);
};