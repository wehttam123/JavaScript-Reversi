import React from 'react';

export default class Gameboard extends React.Component <{size:string},{size:number}> {
    constructor(props: any) {
        super(props);
        this.state = {size: props.size};
    }
    render(){
      let rows = [];
      for (let r = 0; r < this.state.size; r++){
        let cell = [];
        for (let c = 0; c < this.state.size; c++){
          cell.push(<td key={c} id={"col " + c}> {r} {c} </td>)
        }
        rows.push(<tr key={r} id={"row " + r}> {cell} </tr>)
      }
      return(
        <div className="container">
          <table id="gameboard">
            {rows}
          </table>
        </div>
      )
    }
  }