import React, { Component } from 'react';

import SocketFrame from "./SocketFrame"

class App extends Component {

  constructor() {
    super();
    this.state = {
      frames: []
    };

  }

  componentDidMount() {
    this.addFrame();
    this.addFrame();
  }

  render() {
    return (
      <div className="App" style={{overflow: "hidden"}}>
        <button onClick={this.addFrame}>Add frame</button>
        <div className="row">
          {this.state.frames.map((frame, i) => (
            <div className="col-md-3" key={i}>
              <SocketFrame/>
            </div>
          ))}
        </div>
      </div>
    );
  }

  addFrame = () => {
    this.setState((prev) => {
      return {...prev, frames: [...prev.frames, {}]}
    })
  }
}

export default App;
