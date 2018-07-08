'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var defaultMessage = '{actual} is not equal {expected}';
var assert = exports.assert = function assert(actual, expected) {
  var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultMessage;

  if (actual === expected) {
    return assert;
  } else {
    throw new Error(message.replace('{actual}', actual).replace('{expected}', expected));
  }
};
var defaultBlockMessage = 'Test {name} passed!';
var defaultErrorMessage = 'Test {name} failed!';
var block = exports.block = function block(name, callback) {
  var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultBlockMessage;
  var errMessage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultErrorMessage;

  try {
    callback();
    console.log(message.replace('{name}', name));
  } catch (err) {
    console.error(err);
    console.error(errMessage);
  }
};