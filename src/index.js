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
  list: [
    {
      key: 't1',
      label: 'test1',
    },
    {
      key: 't2',
      label: 'test2',
    },
    {
      key: 't3',
      label: 'test3',
    },
  ]
};

const m = new Model({
  state,
  mount: '#root',
  render() {
    const { title, clickTime, styles, t, flag, list } = this.state;
    const l = list.map(v => (
        <li key={v.key}>{v.label}</li>
      ))
    return (
      <div>
        <h1 className={flag ? css.title: ''}>{title}</h1>
        <button onClick={this.change}>You should change!</button>
        <p style={styles}>click: {clickTime}</p>
        <div></div>
        <div>{t}</div>
        <ul>{l}</ul>
        {flag && <div>123</div>}
      </div>
    )
  },
  change() {
    console.log(this, 'change');
    this.state.title = 'Begin!';
    this.state.flag = !this.state.flag;
    this.state.clickTime = this.state.clickTime + 1;
    this.state.list.splice(1,0,this.state.list.splice(0,1)[0]);
    // setTimeout(() => {
      this.state.styles.color = 'green';
    // }, 3000);
  }
})

