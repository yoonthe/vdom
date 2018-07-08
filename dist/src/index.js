'use strict';

var _domRender = require('./dom/dom-render');

var _domRender2 = _interopRequireDefault(_domRender);

var _config = require('./vdom/config');

var _Model = require('./vdom/classes/Model');

var _Model2 = _interopRequireDefault(_Model);

var _h = require('./vdom/h');

var _h2 = _interopRequireDefault(_h);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _config.setRender)(new _domRender2.default());

var state = {
  title: 'Yoonthe\'s Show!',
  clickTime: 0,
  styles: { color: 'red' }
};

var m = new _Model2.default({
  state: state,
  mount: '#root',
  render: function render() {
    var _state = this.state,
        title = _state.title,
        clickTime = _state.clickTime,
        styles = _state.styles;

    return (0, _h2.default)(
      'div',
      null,
      (0, _h2.default)(
        'h1',
        null,
        title
      ),
      (0, _h2.default)(
        'button',
        { onClick_once: this.change },
        'You should change!'
      ),
      (0, _h2.default)(
        'p',
        { style: styles },
        'click: ',
        clickTime
      )
    );
  },
  change: function change() {
    var _this = this;

    console.log(this, 'change');
    this.state.title = 'Begin!';
    this.state.clickTime = this.state.clickTime + 1;
    setTimeout(function () {
      _this.state.styles = { color: 'yellow' };
    }, 3000);
  }
});