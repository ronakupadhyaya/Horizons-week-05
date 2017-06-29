class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick= {() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    console.log('this is i', i, 'and this is this.props.square[i]', this.props.squares[i])
    return (<Square
      value={this.props.squares[i]}
      onClick={() => this.props.handleClick(i)}
    />);
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: !!(step % 2),
      step: 0
    }
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(this.calculateWinner(squares) || squares[i]){
      return;
    } else {
      squares[i] = this.state.xIsNext ? "X":"O"
      this.setState({history: history.concat([{squares: squares}]) , xIsNext: !this.state.xIsNext, step: history.length});
    }
  }

  calculateWinner(arr) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]

    for(let i = 0; i < lines.length; i++) {
      const [a,b,c] = lines[i];
      if(arr[a] && arr[a] === arr[b] && arr[a] === arr[c]) return arr[a]
    }

    return null;
  }
  
  jumpTo(index) {
    this.setState({step: index});
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares;

    const winner = this.calculateWinner(squares);
    var status =  winner ?
      ('Winner: ' + winner) :
      ('Next Player: '+ (this.state.xIsNext ? "X":"O"));


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            handleClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{history.map((item, index) => {
              return index ?
                <li key={index}><a href="#" onClick={() => this.jumpTo(index)}>Move #{index}</a></li>:
                <li key={index}><a href="#" onClick={() => this.jumpTo(index)}>Game Start</a></li>
            })}</ol>
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
