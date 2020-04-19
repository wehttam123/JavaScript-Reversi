import React from 'react';

export default class Menu extends React.Component <{ start: any, class: string, theme: string }, { theme: string }> {
   
    constructor(props: any) {
        super(props);

        this.state = { theme: props.theme };
    }

    start = () => {
        this.props.start("active");
      };

    render() {
        return (
            <div className={this.props.class}>
                <table className="menu">
                    <tr>
                    <h2>Username: User1</h2>
                    <input></input>
                    <button className="btn" id="classicbtn">
                        Update username
                    </button>
                    </tr>
                    <tr>
                    <h2>Gamecode: 12345</h2>
                    <p>To start a new game, give this game code to your opponent. If they enter it below and press join game, the game will start. </p>
                    <input></input>
                    <button className="btn" id="classicbtn" onClick={this.start}>
                        Join existing game
                    </button>
                    </tr>
                    <tr>
                    <button className="btn" id="classicbtn" onClick={this.start}>
                        Start local game
                    </button>
                    </tr>
                    <button className="btn" id="classicbtn" onClick={this.start}>
                        Start random game
                    </button>
                </table>
            </div>
        )
    }
}