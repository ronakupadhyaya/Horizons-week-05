/*********************************************************
 * !!! WARNING !!!
 * I haven't properly linked this file with the html file!
 *********************************************************/

//SQUARE CLASS
function Square(props) {
  return (
      <button className="square" onClick={() => (props.onClick())}>
        {props.value}
      </button>
    );
};


//BOARD CLASS
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
  }

  render() {
    var num = [0, 1, 2]
    return (
      <div>
        {num.map((x) => (
          <div className="board-row">
            {num.map((y) => (this.renderSquare(x*3+y)))}
          </div>
        ))}
      </div>
    );
  }
}


//GAME CLASS
class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: [null, null, null, null, null, null, null, null, null]
      }],
      xIsNext: true,
      key: 0
    }
  }

  handleClick(i) {
    const history = this.state.history.slice();
    const current = history[history.length - 1].squares.slice();
    if (current[i] || calculateWinner(current)) {
      return;
    }
    current[i] = (this.state.xIsNext ? 'X' : 'O');
    history.push({squares: current});
    this.setState({history: history, xIsNext: !this.state.xIsNext, key: history.length - 1});
  }

  jumpTo(move) {
    this.setState({key: move});
  }

  renderBoard() {
    const history = this.state.history.slice();
    const current = history[this.state.key].squares.slice();
    return <Board squares={current} onClick={(i) => this.handleClick(i)} />;
  }

  render() {
    const history = this.state.history;
    const moves = history.map((step, move) => {
        const desc = move ?
            'Move #' + move :
            'Game start';
        return (
            <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}>{(move === this.state.key ? <strong>{desc}</strong> : desc)}</a>
            </li>
        );
    });
    const current = history[history.length - 1].squares;
    const winner = calculateWinner(current);
    let status;
    if (winner) {
      status = winner + ' has won!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          {this.renderBoard()}
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


//HELPER FUNCTIONS
function calculateWinner(board) {
  for (var i = 0; i < 3; i++) {
    if (isEq(board[i*3], board[(i*3)+1], board[(i*3)+2]) || isEq(board[i], board[i+3], board[i+6])) {
      return board[i];
    }
  }
  if (isEq(board[2], board[4], board[6])) {
    return board[2];
  }
  if (isEq(board[0], board[4], board[8])) {
    return board[0];
  }
  return null;
}

function isEq(a, b, c) {
  return a && b && c && a === b && b === c && a === c;
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
