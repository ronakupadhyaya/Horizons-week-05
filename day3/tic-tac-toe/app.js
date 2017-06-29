var React = require('react');
var ReactDOM = require('react-dom');


class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {/* TODO */}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
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

//you can tell it's JSX because it has HTML looking shit
class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{this.props.number}</div>
        
        </div>
      </div>
    );
  }
}

// ========================================

class Compy extends React.Component{
  render(){
    return (
      <div className= "some_class"
        <h1 Hello /h1>
        <p This is react </p>

    );
  }
}

var jsxElement = (
  <div className="some_class">
    <h1>Hello</h1>
    <p>This is React</p>
  </div>
)


ReactDOM.render(
  jsxElement,
  document.getElementById('root')
);
