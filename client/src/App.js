import React, { Component } from 'react';

import SocketFrame from "./SocketFrame"

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      frames: []
    };

  }

  componentDidMount() {
    this.addFrame();
    this.addFrame();
    this.addFrame();
  }

  render() {
    return (
      <div className="App" style={{overflow: "hidden", padding: 10}}>
        <div className="container">
        <button onClick={this.addFrame}>Add frame</button>
        </div>
        <div className="row" style={{marginTop: 10}}>
          {this.state.frames.map((frame) => (
            <div className="col-md-3 col-xxl-2 frame-container" key={frame.id}>
              <SocketFrame onClose={() => {this.removeFrame(frame.id)}}/>
            </div>
          ))}
        </div>
      </div>
    );
  }

  addFrame = () => {
    this.setState((prev) => {
      const frame = {id: Math.random().toString(36).substr(2, 5)};
      return {...prev, frames: [...prev.frames, frame]}
    })
  };

  removeFrame = (id) => {
    this.setState(prev => {
      const frames = [...prev.frames];
      const removeIndex = frames.findIndex(frame => frame.id === id);
      frames.splice(removeIndex, 1);
      return {...prev, frames}
    });
  };

}

export default App;
