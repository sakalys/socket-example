import React from "react";

const frameStyle = {
  minHeight: 10,
  borderBottom: '1px solid gray',
};

export default class SocketFrame extends React.Component {

  constructor() {
    super();
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
    this.setState(prev => {
      const messages = [...prev.messages, "Connecting..."];

      return {...prev, messages, connected: true}
    })
  };

  submit = (e) => {
    e.preventDefault();

    this.setState((prev) => {
      const history = [...prev.history];

      history.push(prev.input);

      const messages = [...prev.messages, `$ ${prev.input}`];

      return {...prev, input: "", history, messages}
    })
  };

}