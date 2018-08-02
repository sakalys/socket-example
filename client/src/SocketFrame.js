import React from "react";
import openSocket from 'socket.io-client';

const frameStyle = {
  minHeight: 10,
  borderBottom: '1px solid gray',
};

export default class SocketFrame extends React.Component {

  constructor() {
    super();
    this.socket = null;

    this.state = {
      input: "",
      history: [],
      lines: [],
      connected: false,
    }
  }

  componentDidMount() {
    this.establishConnection();
  }

  componentWillUnmount() {
    this.dropConnection();
  }

  render() {
    return (
      <div style={frameStyle}>

        <div className="text-monospace" style={{height: "300px"}}>
          {this.state.lines.map((line, i) => {
            const style = {};
            if (line.own) {
              style.color = "blue";
            }

            return (
              <div style={style} key={i}>{line.text}</div>
            )
          })}
        </div>


        <form onSubmit={this.submit} className="row">

          <div className="col" style={{paddingRight: 0}}>
            <input
              style={{width: "100%", borderRight: 0}}
              value={this.state.input}
              onChange={(e) => {
                this.setState({input: e.target.value})
              }}/>
          </div>

          <div className="col-auto" style={{paddingLeft: 0}}>
            <button>Send</button>
          </div>
        </form>
      </div>
    );
  }

  establishConnection = () => {
    this.socket = openSocket('http://localhost:3001', {
      // forceNew: true,
      autoConnect: false,
      reconnection: false,
    });

    this.socket.open();
    this._print('Connecting');

    this.socket.on('connect', () => {

      this._print("Connected");
      this.setState(prev => ({...prev, connected: true}));
    });

    this.socket.on('message', (message) => {
      this._print(`> (${message.from}) ${message.text}`);
    });
  };

  submit = (e) => {
    e.preventDefault();

    if (!this.state.connected) {
      return;
    }

    const input = this.state.input;

    if (input.startsWith('/')) {
      if (input.startsWith('/private')) {

      }

      return;
    }

    this.socket.emit('message', input);

    this.setState((prev) => {
      const history = [...prev.history];
      history.push(prev.input);

      return {...prev, input: "", history}
    });

    this._print('$ ' + input, {own: true});
  };


  _print(text, opts = {}) {
    this.setState((prev) => {

      const lines = [...prev.lines, {text, ...opts}];

      return {...prev, lines}
    });
  }
}