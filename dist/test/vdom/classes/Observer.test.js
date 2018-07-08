'use strict';

var _Observer = require('../../../src/vdom/classes/Observer');

var _Observer2 = _interopRequireDefault(_Observer);

var _test = require('../../test');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _test.block)('observer', function () {
  var updateTime = 0;
  var o = {
    test: {
      t: 1
    },
    d: 2
  };
  var t = new _Observer2.default(o, function () {
    updateTime++;
  });
  (0, _test.assert)(t.test.t, 1)(t.d, 2);

  t.test.t = 3;
  (0, _test.assert)(t.test.t, 3)(updateTime, 1);

  t.d = 4;
  (0, _test.assert)(t.d, 4)(updateTime, 2);

  t.test = { tt: 1 };
  (0, _test.assert)(t.test.t, undefined)(t.test.tt, 1)(updateTime, 3);

  t.test.tt = 11;
  (0, _test.assert)(t.test.tt, 11)(updateTime, 4);

  t.test.t = [1, 2];
  (0, _test.assert)(t.test.t[0], 1)(t.test.t[1], 2)(t.test.tt, 11)(updateTime, 5);

  t.test.t.push(33);
  var arr = t.test.t;

  (0, _test.assert)(arr[0], 1)(arr[1], 2)(arr[2], 33)(updateTime, 7);
});