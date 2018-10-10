import React, { Component } from 'react';

class App extends Component {
  state = {
    query: ''
  };

  render() {
    return (
      <div>
        <h1>Enter query:</h1>
        <input type="text" onChange={(val) => this.setState({query: val})}></input>
      </div>
    );
  }
}

export default App;
