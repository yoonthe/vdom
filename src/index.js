import DomRender from './dom/dom-render';
import { setRender, enableDebug } from './vdom/config';
import Model from './vdom/classes/Model';
import css from './styles.less';
import h from './vdom/h';

enableDebug();
if(setRender(new DomRender())) {
  console.log('set Render Succeed!');
} else {
  console.log('set Render failed!');
}

const state = {
  title: 'Yoonthe\'s Show!',
  clickTime: 0,
  styles: { color: 'red' },
  t: null,
  flag: true,
};

const m = new Model({
  state,
  mount: '#root',
  render() {
    const { title, clickTime, styles, t, flag, list } = this.state;
    const l = list.map(v => {
      return (
        <div key={v.key}>{v.label}</div>
      )    })
    return (
      <div>
        <h1 className={flag ? css.title: ''}>{title}</h1>
        <button onClick={this.change}>You should change!</button>
        <p style={styles}>click: {clickTime}</p>
        <div></div>
        <div>{t}</div>
      </div>
    )
  },
  change() {
    console.log(this, 'change');
    this.state.title = 'Begin!';
    this.state.flag = !this.state.flag;
    this.state.clickTime = this.state.clickTime + 1;
    setTimeout(() => {
      this.state.styles.color = 'green'
    }, 3000);
  }
})

