const PromisePolyfill = require('./index');

const a = new PromisePolyfill((resolve, reject) => {
  setTimeout(() => resolve(1), 1000);
  setTimeout(() => reject(1), 1000);
})
.then(v => v * 100)
.then(v => v * 100, v => v -1000)
.then(v => console.log('resolve', v))
.catch(e => console.log('reject', e));

const b = PromisePolyfill.all([new PromisePolyfill(r => setTimeout(r, 1000, 3)), PromisePolyfill.resolve(1), new PromisePolyfill(r => setTimeout(r, 100, 2))]);

const c = PromisePolyfill.race([new PromisePolyfill(r => setTimeout(r, 1000, 3)), PromisePolyfill.resolve(1), new PromisePolyfill(r => setTimeout(r, 100, 2))]);

console.log(a);
setTimeout(() => {
  console.log(a, b, c);
}, 2000);
// console.log('beforeend', 
//         '> 开始 (<small>同步代码开始</small>)<br/>');

//     // 新构建一个 Promise 实例：使用Promise实现每过一段时间给计数器加一的过程，每段时间间隔为1~3秒不等
//     let p1 = new Promise(
//         // resolver 函数在 Promise 成功或失败时都可能被调用
//        (resolve, reject) => {
//             console.log('beforeend', 
//                 '> Promise 开始 (<small>异步代码开始</small>)<br/>');
//             // 创建一个异步调用
//             setTimeout(
//                 function() {
//                     // 填充 Promise
//                     resolve(123);
//                 }, Math.random() * 2000 + 1000);
//         }
//     );

//     // Promise 不论成功或失败都会调用 then
//     // catch() 只有当 promise 失败时才会调用
//     p1.then(
//         // 记录填充值
//         function(val) {
//             console.log('beforeend', val +
//                 '> Promise 已填充完毕 (<small>异步代码结束</small>)<br/>');
//         })
//     .catch(
//         // 记录失败原因
//        (reason) => {
//             console.log('处理失败的 promise ('+reason+')');
//         });

//     console.log('beforeend', 
//         '> Promise made (<small>同步代码结束</small>)<br/>');
