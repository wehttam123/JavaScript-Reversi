import React from 'react';

export default class Disc extends React.Component <{ theme: string, update: any, value: string, row: number, col: number }, { row: number, col: number }> {
   
    constructor(props: any) {
        super(props);
        let row = props.row;
        let col = props.col;

        this.state = {
            row: row,
            col: col
        };
    }

    update = () => {
        this.props.update(this.state);
      };

    render() {
        return (
            <div className="box">
                <button className={"square"} id={"square" + this.props.theme} onClick={this.update} >
                    <div className={this.props.value} id={this.props.value + this.props.theme} >
                    </div>
                </button>
            </div>
        )
    }
}