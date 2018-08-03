import React from "react";
import PropTypes from "prop-types";
import openSocket from 'socket.io-client';

const frameStyle = {
  minHeight: 10,
};

export default class SocketFrame extends React.Component {

  constructor() {
    super();
    this.socket = null;

    this.state = {
      input: "",
      history: [],
      rooms: ['public'],
      currentRoom: 'public',
      lines: [],
      connected: false,
    }
  }

  componentDidMount() {
    this.establishConnection();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  componentDidUpdate() {
    this.refs.lines.scrollTop = this.refs.lines.scrollHeight;
  }

  render() {
    return (
      <div style={frameStyle}>

        <div
          ref="lines"
          className="text-monospace"
          style={{height: "300px", fontSize: ".8em", overflowY: 'scroll'}}>
          {this.state.lines.map((line, i) => {

            const style = {whiteSpace: 'pre-wrap'};
            if (line.type) {
              if (line.type === 'own') {
                style.color = "blue";
              }

              if (line.type === 'private') {
                style.color = "#b77e32";
              }

              if (line.type === 'debug') {
                style.color = 'coral';
              }

              if (line.type === 'meta') {
                style.color = 'gray';
              }
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

        {this.state.rooms.length > 1 && (
          <div className="rooms">
            {this.state.rooms.map((room, i) => {
              const style = {};

              if (room !== this.state.currentRoom) {
                style.textDecoration = "underline";
                style.cursor = "pointer";
              }


              return (
                <span key={room}>
                  <span
                    style={style}
                    onClick={() => this.selectRoom(room)}>{room}</span>
                  {i < this.state.rooms.length - 1 ? " - " : ""}
                </span>
              )
            })}
          </div>
        )}

      </div>
    );
  }

  establishConnection = () => {
    const host = 'http://localhost:3001';
    this.socket = openSocket(host, {
      // forceNew: true,
      autoConnect: false,
      reconnection: false,
    });

    this.socket.open();
    this._printLn(`Connecting to ${host}...`, {type: 'debug'});

    this.socket.on('disconnect', () => {
      this.socket = null;
      this.setState({connected: false});
      this._printLn('Disconnected. Reconnect not implemented.', {type: 'debug'});
    });

    this.socket.on('connect', () => {

      this._printLn(`Connected`, {type: 'debug'});
      this.setState({connected: true});
    });

    this.socket.on('greeting', (body) => {
      this._printLn(`Welcome to #${body.channel}. Server time ${body.time}`, {type: 'meta'});
      this._printLn(`Members in channel: ${body.members}.`, {type: 'meta'});
      this._printLn(`Available commands:`, {type: 'meta'});
      this._printLn("  /private {secret} — the private channel", {type: 'meta'});
      this._printLn("  /count — members in channel", {type: 'meta'});
      this._printLn("  /quit — close frame", {type: 'meta'});
    });

    this.socket.on('message', (message) => {
      const print = `>${message.isPrivate ? "(private)" : ""} (${message.from}) ${message.text}`;
      this._printLn(print, {type: "private"});
    });
  };

  selectRoom = (room) => {
    this.setState({currentRoom: room})
  };

  submit = (e) => {
    e.preventDefault();

    if (!this.state.connected || !this.state.input.trim()) {
      return;
    }

    const text = this.state.input;

    this._pushToHistory(text);
    this._clearInput();

    // If input starts with a slash, that means that it it is a command
    if (text.startsWith('/')) {

      // Attempt to join the private channel
      if (text.startsWith('/private')) {
        const secret = text.split(' ')[1] || "";
        this.socket.emit('req_join_private', secret);
        this.socket.once('res_join_private', (result) => {
          if (!result || this.state.rooms.indexOf('private') > -1) {
            return;
          }

          this.setState((prev) => {
            const rooms = [prev.rooms];
            rooms.push('private');

            return {...prev, rooms, currentRoom: 'private'}
          });
        })
      }

      // Request the count of users in channel
      if (text.startsWith('/count')) {
        this.socket.emit('req_channel_count');
        this.socket.once('res_channel_count', (count) => {
          this._printLn(`Members in channel: ${count}`, {type: 'meta'});
        })
      }

      // Close the frame
      if (text.startsWith('/quit')) {
        this.props.onClose();
      }

      return;
    }

    const room = this.state.currentRoom;
    this.socket.emit('req_message', {room, text: text});

    const print = (room === 'private' ? "(private) " : "") + '$ ' + text;
    this._printLn(print, {type: 'own'});
  };

  _pushToHistory(input) {
    this.setState((prev) => {
      const history = [...prev.history];
      history.push(input);
      return {...prev, history}
    });
  }

  _clearInput() {
    this.setState({input: ""});
  }

  _printLn(text, opts = {}) {
    this.setState((prev) => {

      const lines = [...prev.lines, {text, ...opts}];

      return {...prev, lines}
    });
  }
}

SocketFrame.propTypes = {
  onClose: PropTypes.func.isRequired
};
