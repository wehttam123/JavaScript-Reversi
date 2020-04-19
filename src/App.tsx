import React from 'react';
import './App.css';
import Menu from './Menu';
import Gameboard from './Gameboard';

class App extends React.Component <{}, { data: any, menu: string, game: string, theme: string}> {

constructor(props: any) {
  super(props);
  this.state = {
    data: null,
    menu: "active",
    game: "inactive",
    theme: "classic"
  };
}

componentDidMount() {
this.callBackendAPI()
  .then(res => this.setState({ data: res.express }))
  .catch(err => console.log(err));
}

callBackendAPI = async () => {
const response = await fetch('/');
const body = await response.json();

if (response.status !== 200) {
  throw Error(body.message) 
}
return body;
};

start = (data: string) => {
  this.setState({
    menu: "inactive",
    game: "active"
  });
};

classic = () => {
  this.setState({ theme: "classic"});
};

modern = () => {
  this.setState({ theme: "modern"});
};

contrast = () => {
  this.setState({ theme: "contrast"});
};

render() {

  return (
    <div className="App">
      <h1> JavaScript Reversi </h1>
      <Menu start={this.start} class={this.state.menu} theme={this.state.theme}/>
      <Gameboard class={this.state.game} theme={this.state.theme} user1="Player1" user2="Player2"/>
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