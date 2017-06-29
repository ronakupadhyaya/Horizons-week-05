function Square (props) {
      console.log(props.colorTmp)

    return (
      <button className="square" style={props.colorTmp} key={props.key} onClick={ ()=> props.onClick() }>
        {props.value}
      </button>
    );
}



class Board extends React.Component {
  renderSquare(i) {
    return <Square
             value={this.props.squares[i]}
             onClick={()=> this.props.onClick(i)}
             key={i}
             colorTmp={
                 (this.props.colorTmp[0] === i ||
                 this.props.colorTmp[1] === i ||
                 this.props.colorTmp[2] === i) ? { backgroundColor: "yellow"}:{backgroundColor: "white"}}/>;
  }

  render() {

    var boardTmp = [];
    var squaresTmp = [];

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        squaresTmp.push(this.renderSquare( j + i*3 ));
      }
      boardTmp.push(<div className="board-row"> {squaresTmp.slice()} </div>);
      squaresTmp = [];
    }


    return (
      <div>
      {boardTmp}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      history: [{
      squares: Array(9).fill(null)
      }] ,
      stepNumber: 0,
      xIsNext:true,
      sort:true,
      boxToColor:[]
    };
  }

    handleClick(i) {
      const history = this.state.history.slice(0,this.state.stepNumber+1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if(calculateWinner(squares) || squares[i]){
        return;
      }
      squares[i] = this.state.xIsNext ? 'X': 'O';
      this.setState({
        history: history.concat([{
          squares:squares
        }]),
        xIsNext:!this.state.xIsNext,
        stepNumber:history.length
      });
    }

  jumpTo(step) {
    this.setState({
        stepNumber: step,
        xIsNext: (step % 2) ? false : true,
    });
}

    sort() {
    this.setState({
        sort: !this.state.sort,
    });
}

 render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';

      var z = ((move===history.indexOf(current))? { color: "blue"}:{color: "red"});
      return (
        <li key={move}>
          <a href="#" style={z} onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

   console.log("state is", this.state.sort)

   var flag=false;
if(!this.state.sort){
  moves.reverse()
  flag=true;
}
   if(flag === true && this.state.sort === true){
     moves.reverse();
   }

    let status;
    if (winner) {
      this.state.boxToColor=winner;
      status = 'Winner: ' + current.squares[winner[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            colorTmp={this.state.boxToColor}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
           <button onClick={() => this.sort()}>{(this.state.sort? "asc":"desc")} </button>;
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}



// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a,b,c];
    }
  }
  return null;
}
