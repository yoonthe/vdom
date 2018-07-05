const state= Symbol('Model#State');
export default class Model {
  constructor(initState) {
    this[state] = initState;
    this.state = new Proxy(this[state], {
      get() {

      }
    })
  }
  get state() {
    return 
  }
}