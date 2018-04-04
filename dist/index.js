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
);

// render(a);
// import Dom from './dom/dom-core';
console.log(a);