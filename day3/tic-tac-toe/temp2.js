class Board extends React.Component {
  renderSquare(i) {
    return (square({i:i,value:this.props.squares[i], onClick:() => this.props.onClick(i), winningArr:this.props.winningArr}))
  }

  writeBoard() {
    var divs = [];
    for (var i=0;i<3;i++) {
      var element = React.createElement('div', {className:"board-row"}, this.renderSquare(i*3),this.renderSquare(i*3+1),this.renderSquare(i*3+2));
      divs.push(element)
    };
    return divs;
  }

  render() {
    var board = this.writeBoard()
    return (
      <div>
        {board[0]}
        {board[1]}
        {board[2]}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            ascend:true,
        };
    }

  jumpTo(step) {
    this.setState({
        stepNumber: step,
        xIsNext: (step % 2) ? false : true,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
          squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  moves() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    var moves = history.map((step, move) => {
      var moveA = move;
      if (this.state.ascend) {
        var desc = moveA ?
          'Move #' + moveA :
          'Game start';
      } else {
        moveA = history.length-move-1
        var desc = moveA ?
          'Move #' + moveA :
          'Game start';
      }
      var styles = {};
      if (move === history.indexOf(current)) {
        styles="move"
      }
      return (
          <li key={move}>
              <a href="#" className={styles} onClick={() => this.jumpTo(move)}>{desc}</a>
          </li>
      );
    });
    return moves;
  }

  toggleButton() {
    this.setState({
      ascend:!this.state.ascend,
      history:this.state.history.reverse(),
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    var moves = this.moves();
    var winningArr = null;
    let status;
    if (winner) {
        status = 'Winner: ' + winner[0];
        winningArr = winner[1];
    } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    var toggle = React.createElement('button',{onClick:()=>this.toggleButton()}, this.state.ascend ?"Desending":"Ascending");
    return (
        <div className="game">
            <div className="game-board">
                <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                winningArr={winningArr}
            />
        </div>
        <div className="game-info">
            <div>{status}</div>
            <div>Sorting:    {toggle}</div>
            <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            console.log([squares[a],lines[i]]);
            return [squares[a],lines[i]];
        }
    }
    return null;
}

function square(props) {
  var style = null;
  if (props.winningArr && (props.winningArr.indexOf(props.i) !== -1) ){
    style = {"background":"red"};
  }
  return (
      <button className="square" style={style} onClick={() => props.onClick()}>
          {props.value}
      </button>
  );
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
