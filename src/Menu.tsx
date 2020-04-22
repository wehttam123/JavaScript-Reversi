import React from 'react';
import socketIOClient from 'socket.io-client'

export default class Menu extends React.Component <{ start: any, usernames: any, savedTheme: any, class: string, theme: string }, { username: string, theme: string, gamecode: number }> {
   
    constructor(props: any) {
        super(props);

        this.state = { 
            username: "User1",
            theme: "classic",
            gamecode: 1234567890
        };
    }

    start = () => {
        this.props.start("active");
      };

    usernames = () => {
        this.props.usernames(this.state.username);
    };

    savedTheme = () => {
        this.props.savedTheme(this.state.theme);
    };

    userChange = (event: any) => {
        this.setState({ username: event.target.value });
    };
    
    userClick = () => {
        document.cookie = "username=" + this.state.username;
        this.usernames();
    };

    componentDidMount = () => { 
        this.setState({username: getUserCookie()}, () => {
            this.usernames();
            this.setState({theme: getThemeCookie()}, () => {
                 document.cookie = "theme=" + this.state.theme;
                 this.savedTheme();
            });
        });
          
        const socket = socketIOClient("localhost:5000");
        socket.on('gamecode', (gamecode: number) => {
            this.setState({gamecode: gamecode});
        })
    }
    
    render() {
        //const socket = socketIOClient("localhost:5000");
        return (
            <div className={this.props.class}>
                <table className="menu">
                    <tr>
                    <h2>Username: {this.state.username}</h2>
                    <input onChange={this.userChange}></input>
                    <button className="btn" id={this.props.theme+"btn"} onClick={this.userClick}>
                        Update username
                    </button>
                    </tr>
                    <tr>
                    <h2>Gamecode: <code>{this.state.gamecode}</code></h2>
                    <p>To start a new game, give this game code to your opponent. If they enter it below and press join game, the game will start. </p>
                    <input></input>
                    <button className="btn" id={this.props.theme+"btn"} onClick={this.start}>
                        Join existing game
                    </button>
                    </tr>
                    <tr>
                    <button className="btn" id={this.props.theme+"btn"} onClick={this.start}>
                        Start local game
                    </button>
                    </tr>
                    <button className="btn" id={this.props.theme+"btn"} onClick={this.start}>
                        Start random game
                    </button>
                </table>
            </div>
        )
    }
}

function getUserCookie() {
    var name = "username=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }

    let parts = [];
    parts.push( ["Small", "Big", "Medium", "Miniscule", "Huge"] );
    parts.push( ["Red", "Blue", "Bad", "Good", "Round", "Ferocious"] );
    parts.push( ["Bear", "Dog", "Potato", "Dragon", "Cat"] );

    let username = "";
    let part;

    for( part of parts) {
        username += part[Math.floor(Math.random()*part.length)];
    }
    return username;
  }

  function getThemeCookie() {
    var name = "theme=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }

    return "classic";
  }