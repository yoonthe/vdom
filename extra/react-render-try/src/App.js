import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const style = {
  background: '#F00'
};
class App extends Component {
  state= {
    items: ['item1', 'item2'],
    test: false,
  };
  render() {
    console.log('render',this.state.items);
    const items = this.state.items.map(i => (
      <li id={i} key={i}>{i}</li>
    ));
    const div = <div>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {items}
        <button onClick={this.itemChange}>change</button>
      </div>
    </div>
    return this.state.test ? (
    <div style={style}>{div}</div>
    ) : div;
  }
  change() {
    this.setState({
      items: ['item2', 'item1'],
      test: true,
    });
    setTimeout(() => {
      this.setState({
        items: ['item1', 'item2'],
        test: false,
      });
    }, 100);
  }
  componentWillMount() {
    this.itemChange = this.change.bind(this);
  }
  componentWillUpdate() {
    console.log('update',this.state.items);
  }
}

export default App;
