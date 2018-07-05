'use strict';

var _domCore = require('./dom/dom-core');

var _domCore2 = _interopRequireDefault(_domCore);

var _h = require('./vdom/h');

var _h2 = _interopRequireDefault(_h);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var a = (0, _h2.default)(
    'ul',
    { 'class': 'test' },
    (0, _h2.default)(
        'li',
        null,
        'item1'
    ),
    (0, _h2.default)(
        'li',
        null,
        'item2'
    )
);
var b = (0, _h2.default)(
    'div',
    null,
    'Test'
);
_domCore2.default.render(a);
setTimeout(function () {
    _domCore2.default.render(b);
}, 3000);