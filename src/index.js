import DomRender from './dom/dom-render';
import { setRender } from './vdom/config';
import Model from './vdom/classes/Model';
import h from './vdom/h';

setRender(new DomRender());

const state = {
  title: 'Yoonthe\'s Show!'
};

const m = new Model({
  state,
  mount: '#root',
  render() {
    const { title } = this.state;
    return (
      <div>
        <h1>{title}</h1>
        <button onClick={this.change}>You should change!</button>
      </div>
    )
  },
  change() {
    console.log(this, 'change');
    this.state.title = 'Begin!';
  }
})

