import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import styled from 'styled-components'

//function component:
//a simpler way to write components that only would contain a render method
//and not their own state. (Board handles Square's state.)
// function Square(props){
//   return (
//     <button 
//     className="square" 
//     onClick={props.onClick}
//     >
//       {props.value}
//     </button>
//   );
// }

//styled-components
  //a common way to make style
  //big downside: devtools css naming is gibberish
const Row = styled.div`
  &::after{
    clear: both;
    content: "";
    display: table;
  }
`

class Board extends React.Component {
  //"Compound components"
    //Lambda function component stored in a static variable
  static Square = ({value, onClick}) => <button 
  className="square" 
  onClick={onClick}
  >
    {value}
  </button>
  renderSquare(i) {
    return <Board.Square 
    value={this.props.squares[i]}
    onClick={()=>this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <>
        <Row>
          {this.renderSquare(0)} 
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </Row>
        <Row>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </Row>
        <Row>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </Row>
      </>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        selectedIndex: null,
      }],
    
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length-1]
    const squares = current.squares.slice();
    /*
      const squares = this.state.squares.slice()
      A copy of this.state.squares.slice is passed to squares
      Immutability is important for tracking changes and knowing
      when to reRender components.
    */ 

    //if someone has won or if the square has already been clicked, don't do anything upon clicking that square
    if(calculateWinner(squares) || squares[i]) {
      return
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        selectedIndex: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  determineClickLocation(i){  
    //top: 0,1,2
    //middle: 3,4,5
    //bottom: 6,7,8

    //left: 0,3,6
    //center: 1,4,7
    //right: 2,5,8
    let movePosition

    switch(i){
      case 0:
      movePosition = "Top-Left"
      break
      case 1:
      movePosition="Top-Middle"
      break
      case 2:
      movePosition = "Top-Right"
      break
      case 3:
      movePosition = "Middle-Left"
      break
      case 4:
      movePosition = "Middle-Center"
      break
      case 5:
      movePosition = "Middle-Right"
      break
      case 6:
      movePosition = "Bottom-Left"
      break
      case 7:
      movePosition = "Bottom-Center"
      break
      case 8:
      movePosition = "Bottom-Right"
      break
      default:
      movePosition = ""
    }
    return movePosition
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    //const selectedIndex = current.selectedIndex
    //const clickLocation = this.determineClickLocation(selectedIndex)
    //const currentNumber = this.state.stepNumber
    //the difference between current and history[stepNumber-1] shows which element was altered

    //alternatively, we can check the thing that makes the difference between current and history[stepNumber-1]
      //handleClick(i) -> make a copy of and edit squares[i]
        //handleClick is sent to onClick(i)
          //the value of i in handleClick(i) tells which label needs to be sent to the different history buttons

    const winner = calculateWinner(current.squares)

    
    const moves = history.map((step, move) => {
      const description = move ? 'Go to move #' + move : 'Go to game start'
      const selectedIndex = step.selectedIndex      
      const clickLocation = this.determineClickLocation(selectedIndex)
      
      //for each element in history, display it by index as a list item:
      //We return an array of list items and render it.
      //It’s strongly recommended that you assign proper keys whenever you build dynamic lists.
      //Generally, don't use index as key, but here it is fine because we aren't swapping array positions
      return (
        <li key={move}>
          <button onClick={()=>this.jumpTo(move)}> {description}</button> <label>{clickLocation}</label>
        </li>
      )//put in the location of the move here => based on current
    })

    let status;
    if(winner){
      status = 'Winner: ' + winner
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
