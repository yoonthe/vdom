"use strict";

var h = function h(type, props) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
    }

    return { type: type, props: props, children: children };
};

var a = h(
    "ul",
    { "class": "test" },
    h(
        "li",
        null,
        "item1"
    ),
    h(
        "li",
        null,
        "item2"
    )
);

console.log(JSON.stringify(a));