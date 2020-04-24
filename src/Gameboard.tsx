import React from 'react';
import Disc from './Disc';

export default class Gameboard extends React.Component<{ class: string, theme: string, user1: string, user2: string, type: string, input: string, enable: any, room: any, socket: any }, { size: number, states: any, player1: string, player2: string, score1: number, score2: number, winner: string, win: string, indicator: string, turn: number, currentTurn: string, render: boolean }> {
  constructor(props: any) {
    super(props);

    let states = [];
    for (let r = 0; r < 8; r++) {
      let state = [];
      for (let c = 0; c < 8; c++) {
        if ((r === 3 && c === 3) || (r === 4 && c === 4)) {
          state.push("black");
        } else if ((r === 3 && c === 4) || (r === 4 && c === 3)) {
          state.push("white");
        } else if ((r === 2 && c === 4) || (r === 3 && c === 5) || (r === 4 && c === 2) || (r === 5 && c === 3)) {
          state.push("possible");
        } else {
          state.push("blank");
        }
      }
      states.push(state);
    }

    this.state = {
      size: 8,
      states: states,
      player1: "black",
      player2: "white",
      score1: 2,
      score2: 2,
      winner: "",
      win: "inactive",
      indicator: "active",
      turn: 1,
      currentTurn: props.user1,
      render: true
    };
  }

  componentDidUpdate = () => {
    if (this.props.input === "disable") {
      let states = this.state.states;
      states = this.clearPossible(states);
      this.props.enable();
    }
  }

  componentDidMount = () => {
    this.props.socket.on('network state', (state: any) => {
      this.setState({
        states: state.states,
        player1: state.player1,
        player2: state.player2,
        score1: state.score1,
        score2: state.score2,
        winner: state.winner,
        win: state.win,
        indicator: state.indicator,
        turn: state.turn,
        currentTurn: state.currentTurn,
        render: true
      }, () => {
        this.props.socket.emit('clear', this.props.room);
      });
    });

    this.props.socket.on('clear', () => {
      let clear = this.state.states;
      clear = this.clearPossible(clear);
      this.setState({ states: clear }, () => {
      });
    });
  }

  update = (data: any) => {
    let row = data.row;
    let col = data.col;
    let player = this.state.player1;
    let opponent = this.state.player2;
    let updated = this.state.states;
    let turn = this.state.turn;

    if (this.state.render === true) {

      if (this.state.states[row][col] === "possible") {
        if (turn === 1) {
          updated[row][col] = player;
          updated = this.flipDiscs(updated, row, col, player, opponent);
          updated = this.clearPossible(updated);
          updated = this.findPossible(updated, opponent, player);
          if (this.checkPossible(updated)) {
            turn = 2;
          } else {
            updated = this.findPossible(updated, player, opponent);
            if (this.checkPossible(updated)) {
              turn = 1;
            } else {
              turn = 3;
            }
          }
        } else if (turn === 2) {
          updated[row][col] = opponent;
          updated = this.flipDiscs(updated, row, col, opponent, player);
          updated = this.clearPossible(updated);
          updated = this.findPossible(updated, player, opponent);
          if (this.checkPossible(updated)) {
            turn = 1;
          } else {
            updated = this.findPossible(updated, opponent, player);
            if (this.checkPossible(updated)) {
              turn = 2;
            } else {
              turn = 3;
            }
          }
        }
      }

      if (turn === 3) {
        let winner = "";
        if (this.state.score1 > this.state.score2) {
          winner = this.props.user1;
        } else if (this.state.score1 === this.state.score2) {
          winner = "tie";
        } else {
          winner = this.props.user2
        }
        this.setState({
          indicator: "inactive",
          win: "active",
          winner: winner
        });
      }

      this.updateScore(updated);

      this.updateTurn(turn);

      if (this.props.type === "network") {
        this.setState({
          states: updated,
          turn: turn,
          render: false
        }, () => {
          this.props.socket.emit('update room', this.props.room, this.state);
        });
      } else {
        this.setState({
          states: updated,
          turn: turn,
          render: true
        });
      }
    }
  };

  flipDiscs = (board: any, row: number, col: number, player: string, opponent: string) => {
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if ((r >= 0 && r <= 7 && c >= 0 && c <= 7) && !(row === r && c === col)) {
          if (board[r][c] === opponent) {
            let direction = this.direction(row, col, r, c);
            if (this.checkLine(board, row, col, direction, player, opponent)) {
              board = this.flipLine(board, row, col, direction, player, opponent);
            }
          }
        }
      }
    }
    return board;
  }

  direction = (row: number, col: number, r: number, c: number) => {
    let direction = "";

    if (r < row && c === col) {
      direction = "up";
    }
    if (r > row && c === col) {
      direction = "down";
    }
    if (r === row && c < col) {
      direction = "left";
    }
    if (r === row && c > col) {
      direction = "right";
    }
    if (r < row && c > col) {
      direction = "upright";
    }
    if (r > row && c > col) {
      direction = "downright";
    }
    if (r < row && c < col) {
      direction = "upleft";
    }
    if (r > row && c < col) {
      direction = "downleft";
    }

    return direction
  }

  checkLine = (board: any, row: number, col: number, direction: string, player: string, opponent: string) => {
    let found = false;
    let end = false;

    while (!end) {
      switch (direction) {
        case "up":
          row = row - 1;
          break;
        case "down":
          row = row + 1;
          break;
        case "left":
          col = col - 1;
          break;
        case "right":
          col = col + 1;
          break;
        case "upright":
          row = row - 1;
          col = col + 1;
          break;
        case "downright":
          row = row + 1;
          col = col + 1;
          break;
        case "upleft":
          row = row - 1;
          col = col - 1;
          break;
        case "downleft":
          row = row + 1;
          col = col - 1;
          break;
      }
      if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
        switch (board[row][col]) {
          case opponent:
            break;
          case player:
            found = true;
            end = true;
            break;
          case "blank":
          case "posible":
            end = true;
            break;
        }
      } else {
        end = true;
      }
    }

    return found;
  }

  flipLine = (board: any, row: number, col: number, direction: string, player: string, opponent: string) => {
    let end = false;

    while (!end) {
      switch (direction) {
        case "up":
          row = row - 1;
          break;
        case "down":
          row = row + 1;
          break;
        case "left":
          col = col - 1;
          break;
        case "right":
          col = col + 1;
          break;
        case "upright":
          row = row - 1;
          col = col + 1;
          break;
        case "downright":
          row = row + 1;
          col = col + 1;
          break;
        case "upleft":
          row = row - 1;
          col = col - 1;
          break;
        case "downleft":
          row = row + 1;
          col = col - 1;
          break;
      }
      if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
        switch (board[row][col]) {
          case opponent:
            board[row][col] = player;
            break;
          case player:
          case "blank":
          case "posible":
            end = true;
            break;
        }
      } else {
        end = true;
      }
    }

    return board;
  }

  clearPossible = (board: any) => {
    for (let r = 0; r < this.state.size; r++) {
      for (let c = 0; c < this.state.size; c++) {
        if (board[r][c] === "possible") {
          board[r][c] = "blank";
        }
      }
    }

    return board;
  }

  findPossible = (board: any, player: string, opponent: string) => {
    for (let r = 0; r < this.state.size; r++) {
      for (let c = 0; c < this.state.size; c++) {
        if (board[r][c] === opponent) {
          for (let row = r - 1; row <= r + 1; row++) {
            for (let col = c - 1; col <= c + 1; col++) {
              if ((row >= 0 && row <= 7 && col >= 0 && col <= 7) && !(row === r && c === col)) {
                let direction = this.direction(r, c, row, col);
                if (this.checkLine(board, r, c, direction, player, opponent)) {
                  board = this.setPossible(board, r, c, direction, player, opponent);
                }
              }
            }
          }
        }
      }
    }

    return board;
  }

  checkPossible = (board: any) => {
    let found = false;

    for (let r = 0; r < this.state.size; r++) {
      for (let c = 0; c < this.state.size; c++) {
        if (board[r][c] === "possible") {
          found = true;
        }
      }
    }

    return found;
  }

  setPossible = (board: any, row: number, col: number, direction: string, player: string, opponent: string) => {

    switch (direction) {
      case "up":
        row = row + 1;
        break;
      case "down":
        row = row - 1;
        break;
      case "left":
        col = col + 1;
        break;
      case "right":
        col = col - 1;
        break;
      case "upright":
        row = row + 1;
        col = col - 1;
        break;
      case "downright":
        row = row - 1;
        col = col - 1;
        break;
      case "upleft":
        row = row + 1;
        col = col + 1;
        break;
      case "downleft":
        row = row - 1;
        col = col + 1;
        break;
    }

    if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
      if (board[row][col] === "blank") {
        board[row][col] = "possible";
      }
    }
    return board;
  }

  updateScore = (board: any) => {
    let s1 = 0;
    let s2 = 0;

    for (let r = 0; r < this.state.size; r++) {
      for (let c = 0; c < this.state.size; c++) {
        if (board[r][c] === "black") {
          s1++;
        }
        if (board[r][c] === "white") {
          s2++;
        }
      }
    }

    this.setState({
      score1: s1,
      score2: s2
    });
  }

  updateTurn = (turn: number) => {
    let currentTurn = this.props.user1;

    if (turn === 2) {
      currentTurn = this.props.user2;
    }

    this.setState({ currentTurn: currentTurn });
  }

  render() {
    let board = [];
    for (let r = 0; r < this.state.size; r++) {
      let cell = [];
      for (let c = 0; c < this.state.size; c++) {
        cell.push(<td key={c}><Disc theme={this.props.theme} update={this.update} value={this.state.states[r][c]} row={r} col={c} /></td>);
      }
      board.push(<tr key={r}>{cell}</tr>);
    }
    return (
      <div>
        <div className={this.props.class}>
          <table id="gameboard">
            <tbody>
              {board}
            </tbody>
          </table>
          <table>
            <tr>
              <td>
                <h2>
                  {"Score:"}
                </h2>
                <h3>
                  {this.props.user1}{": "}{this.state.score1}
                  {" "}
                  {this.props.user2}{": "}{this.state.score2}
                </h3>
              </td>
              <td>
                <h2 className={this.state.indicator}>
                  {"Turn:"}
                </h2>
                <h2 className={this.state.win}>
                  {"Winner:"}
                </h2>
                <h3 className={this.state.indicator}>
                  {this.state.currentTurn}
                </h3>
                <h3 className={this.state.win}>
                  {this.state.winner}
                </h3>
              </td>
            </tr>
          </table>
        </div>
      </div>
    )
  }
}
