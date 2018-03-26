import Dom from './dom/dom-core';
import h from './vdom/h';

const a = (
    <ul class="test">
        <li>item1</li>
        <li>item2</li>
    </ul>
)

Dom.mount(Dom.createElement(a));