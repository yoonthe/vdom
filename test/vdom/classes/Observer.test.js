import Observer from '../../../src/vdom/classes/Observer';
const o = {
  test: {
    t:1,
  },
  d:2,
}
const t = new Observer(o,() => { console.log('Update!')});
const out = () => console.log(t.test.t, t.test.tt, t.d);

out();

t.test.t = 3;

out();

t.d = 4;

out();

t.test = { tt:1 };

out();

t.test.tt = 11;

out();

t.test.t = [1,2];

out();

t.test.t.push(33);

out();

const { test, d } = t;

console.log(test,d);