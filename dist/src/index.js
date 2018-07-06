"use strict";

var _h = require("./vdom/h");

var _h2 = _interopRequireDefault(_h);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var a = (0, _h2.default)(
    "ul",
    { "class": "test" },
    (0, _h2.default)(
        "li",
        null,
        "item1"
    ),
    (0, _h2.default)(
        "li",
        null,
        "item2"
    )
); // import Dom from './dom/dom-core';

var b = (0, _h2.default)(
    "div",
    null,
    "Test"
);
Dom.render(a);
setTimeout(function () {
    Dom.render(b);
}, 3000);