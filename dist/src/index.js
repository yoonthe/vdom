'use strict';

var _domRender = require('./dom/dom-render');

var _domRender2 = _interopRequireDefault(_domRender);

var _config = require('./vdom/config');

var _Model = require('./vdom/classes/Model');

var _Model2 = _interopRequireDefault(_Model);

var _styles = require('./styles.less');

var _styles2 = _interopRequireDefault(_styles);

var _h = require('./vdom/h');

var _h2 = _interopRequireDefault(_h);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _config.enableDebug)();
if ((0, _config.setRender)(new _domRender2.default())) {
  console.log('set Render Succeed!');
} else {
  console.log('set Render failed!');
}

var state = {
  title: 'Yoonthe\'s Show!',
  clickTime: 0,
  styles: { color: 'red' },
  t: null,
  flag: true,
  list: [{
    key: 't1',
    label: 'test1'
  }, {
    key: 't2',
    label: 'test2'
  }, {
    key: 't3',
    label: 'test3'
  }]
};

var m = new _Model2.default({
  state: state,
  mount: '#root',
  render: function render() {
    var _state = this.state,
        title = _state.title,
        clickTime = _state.clickTime,
        styles = _state.styles,
        t = _state.t,
        flag = _state.flag,
        list = _state.list;

    var l = list.map(function (v) {
      return (0, _h2.default)(
        'li',
        { key: v.key },
        v.label
      );
    });
    return (0, _h2.default)(
      'div',
      null,
      (0, _h2.default)(
        'h1',
        { className: flag ? _styles2.default.title : '' },
        title
      ),
      (0, _h2.default)(
        'button',
        { onClick: this.change },
        'You should change!'
      ),
      (0, _h2.default)(
        'p',
        { style: styles },
        'click: ',
        clickTime
      ),
      (0, _h2.default)('div', null),
      (0, _h2.default)(
        'div',
        null,
        t
      ),
      (0, _h2.default)(
        'ul',
        null,
        l
      )
    );
  },
  change: function change() {
    console.log(this, 'change');
    this.state.title = 'Begin!';
    this.state.flag = !this.state.flag;
    this.state.clickTime = this.state.clickTime + 1;
    this.state.list.splice(1, 0, this.state.list.splice(0, 1)[0]);
    // setTimeout(() => {
    this.state.styles.color = 'green';
    // }, 3000);
  }
});