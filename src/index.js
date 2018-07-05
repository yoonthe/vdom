import Dom from './dom/dom-core';
import h from './vdom/h';

const a = (
    <ul class="test">
        <li>item1</li>
        <li>item2</li>
    </ul>
)
const b = (
    <div>Test</div>
)
Dom.render(a);
setTimeout(() => {
  Dom.render(b);
}, 3000);
