'use strict';

var _Observer = require('../../../src/vdom/classes/Observer');

var _Observer2 = _interopRequireDefault(_Observer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var o = {
  test: {
    t: 1
  },
  d: 2
};
var t = new _Observer2.default(o, function () {
  console.log('Update!');
});
var out = function out() {
  return console.log(t.test.t, t.test.tt, t.d);
};

out();

t.test.t = 3;

out();

t.d = 4;

out();

t.test = { tt: 1 };

out();

t.test.tt = 11;

out();

t.test.t = [1, 2];

out();

t.test.t.push(33);

out();
var test = t.test,
    d = t.d;


console.log(test, d);