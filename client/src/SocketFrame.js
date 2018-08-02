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
      messages: [],
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
          {this.state.messages.map((message, i) => (<div key={i}>{message}</div>))}
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

    this.socket.on('connect', () => {
      this.setState(prev => {
        const messages = [...prev.messages, "Connected"];

        return {...prev, messages, connected: true}
      })
    });

    this.socket.on('message', (data) => {
      this.setState((prev) => {
        const messages = [...prev.messages, `> ${data}`];

        return {...prev, input: "", messages}
      })
    });

    this.setState(prev => {
      const messages = [...prev.messages, "Connecting..."];

      return {...prev, messages}
    })
  };

  submit = (e) => {
    e.preventDefault();

    if (!this.state.connected) {
      return;
    }

    this.socket.emit('message', this.state.input);

    this.setState((prev) => {
      const history = [...prev.history];

      history.push(prev.input);

      const messages = [...prev.messages, `$ ${prev.input}`];

      return {...prev, input: "", history, messages}
    })
  };

}