import Observer from '../../../src/vdom/classes/Observer';
import { assert, block } from '../../test';

block('observer', () => {
  let updateTime = 0;
  const o = {
    test: {
      t:1,
    },
    d:2,
  }
  const t = new Observer(o,() => { updateTime++;});
  assert(t.test.t, 1)(t.d, 2);

  t.test.t = 3;
  assert(t.test.t, 3)(updateTime, 1)
  
  t.d = 4;
  assert(t.d, 4)(updateTime, 2);

  t.test = { tt:1 };
  assert(t.test.t, undefined)(t.test.tt, 1)(updateTime,3);
  
  t.test.tt = 11;
  assert(t.test.tt, 11)(updateTime, 4);
  
  t.test.t = [1,2];
  assert(t.test.t[0], 1)(t.test.t[1], 2)(t.test.tt, 11)(updateTime, 5);
  
  t.test.t.push(33);
  const { test: { t: arr }} = t;
  assert(arr[0], 1)(arr[1], 2)(arr[2], 33)(updateTime, 7);
});
