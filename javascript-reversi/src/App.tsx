import React from 'react';
import './App.css';
import Menu from './Menu';
import Gameboard from './Gameboard';
import socketIOClient from 'socket.io-client'

const socket = socketIOClient("localhost:5000");

class App extends React.Component <{}, { data: any, menu: string, game: string, theme: string, user1: string, user2: string, type: string, input: string, room: string}> {

constructor(props: any) {
  super(props);
  this.state = {
    data: null,
    menu: "active",
    game: "inactive",
    theme: "classic",
    user1: "Player1",
    user2: "Player2",
    type: "local",
    input: "enable",
    room: ""
  };
}

enable = () => {
  this.setState({input: "enable"});
};

start = (data: string) => {
  this.setState({
    menu: "inactive",
    game: "active",
    type: "local"
  });
};

join = (user:string, room:string) => {
  this.setState({
    user2: user,
    menu: "inactive",
    game: "active",
    type: "network",
    input: "disable",
    room: room
  });
};

setUsername = (user: string) => {
  this.setState({user1: user});
};

joined = (user: string, room: string) => {
  this.setState({
    user2: user,
    menu: "inactive",
    game: "active",
    type: "network",
    input: "enable",
    room: room
  });
};

usernames = (user1:string) => {
  this.setState({
    user1: user1
  });
};

savedTheme = (theme:string) => {
  this.setState({
    theme: theme
  });
};

classic = () => {
  this.setState({ theme: "classic"});
  document.cookie = "theme=classic";
};

modern = () => {
  this.setState({ theme: "modern"});
  document.cookie = "theme=modern";
};

contrast = () => {
  this.setState({ theme: "contrast"});
  document.cookie = "theme=contrast";
};

render() {
  return (
    <div className="App">
      <h1> JavaScript Reversi </h1>
      <Menu start={this.start} join={this.join} joined={this.joined} usernames={this.usernames} setUsername={this.setUsername} savedTheme={this.savedTheme} class={this.state.menu} theme={this.state.theme} socket={socket}/>
      <Gameboard class={this.state.game} theme={this.state.theme} user1={this.state.user1} user2={this.state.user2} type={this.state.type} input={this.state.input} enable={this.enable} room={this.state.room} socket={socket}/>
      <div>
        <p>Themes:</p>
        <button className="btn" id="classicbtn" onClick={this.classic}>Classic</button>
        <button className="btn" id="modernbtn" onClick={this.modern}>Modern</button>
        <button className="btn" id="contrastbtn" onClick={this.contrast}>Contrast</button>
      </div>
      <br/>
      <a href="https://github.com/wehttam123/JavaScript-Reversi"> {"Made using Node, React, and TypeScript"}</a>
    </div>
  );
  }
}

export default App;