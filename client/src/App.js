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
  }

  render() {
    return (
      <div className="App" style={{overflow: "hidden", padding: 10}}>
        <button onClick={this.addFrame}>Add frame</button>
        <div className="row" style={{marginTop: 10}}>
          {this.state.frames.map((frame, i) => (
            <div className="col-md-3" key={i}>
              <SocketFrame onClose={() => {this.removeFrame(i)}}/>
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
  };

  removeFrame = (i) => {
    this.setState(prev => {
      const frames = [...prev.frames];
      delete frames[i];
      return {...prev, frames}
    });
  };

}

export default App;
