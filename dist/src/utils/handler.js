'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var errors = [];
/**
 * 集中处理error
 * @param {Error} err 
 */
var throwError = exports.throwError = function throwError(err) {
  if (err instanceof Error) {
    errors.push(err);
  }
};

var handleErrors = exports.handleErrors = function handleErrors() {
  var handler = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultHandler;

  errors.forEach(function (err) {
    return handler(err);
  });
  errors.splice(0, errors.length);
};

var defaultHandler = function defaultHandler(err) {
  console.error(err);
};

var defaultTimeMess = 'SET time at {time}, cost {interval} ms from last SET!';
var Times = [];
var setTime = exports.setTime = function setTime() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultTimeMess;

  Times.push(new Date());
  var t = Times[Times.length - 1];
  if (Times.length < 2) {
    console.log(message.replace('{time}', t).replace('{interval}', 0));
  } else {
    var last = Times[Times.length - 2];
    console.log(message.replace('{time}', t).replace('{interval}', t.getTime() - last.getTime()));
  }
};