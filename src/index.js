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
  //big downside: devtools css class naming is gibberish
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
  static Square = ({isUsedForVictory, value, onClick, isCatGame}) => <button 
  className="square" 
  onClick={onClick}
  style={{ background: isUsedForVictory ? '#bcd6ff' : isCatGame ? '#ffda60' : '#FFFFFF' }}>
    {value}
  </button>

  renderSquare(i) {
    return <Board.Square 
    isUsedForVictory={this.props.isUsedForVictory(i)}
    value={this.props.squares[i]}
    onClick={()=>this.props.onClick(i)}
    isCatGame={this.props.isCatGame}
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

  static getWinningLines = function(){
    return ([
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ])
  } 

  //returns true if there's a draw. returns false if it's not a draw yet.
  checkIfCatGame(squares) {
    const winningLines = Game.getWinningLines()
  
    //!calculateWinner to make sure no one has won.
    //!squares[i].includes(null) to make sure there are no empty spaces to fill
      //if these conditions are met, it is a cat game. Otherwise, the game continues.
  
    if (!calculateWinner(squares)) {
      //if(this.state.stepNumber === 9){ //This would be less computation, but there's a magic number 9(or maybe 8). 
        //I could define a constant, but I want to get this working rather than work on optimizing something that doesnt work yet.
      if(!squares.includes(null)){
        return true
      }
    }
    
    return false
  }

  //this method turns only the winning squares light blue to highlight the 3 in a row.
    //this rechecks for each square.
      //This is okay with a small application -> it's just a tic tac toe game with 9 spaces.
        //if it were more complex, i would want to check what indices are used for victory once and then refer to that list
          //(rather than checking 9 times for each victory.)
  checkIfUsedForVictory(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length-1]
    const squares = current.squares.slice();
    
    //If there is no winner, no squares are used for victory, so return false
    if(!calculateWinner(squares)) {
      return false
    }
    else{
      //look at squares[] and check if any rows, cols, or diags are all 'X' or all 'O'.
        //Because of this if/else, surely one row/col/diag is filled with 'X' or 'O'
        
      /*
      const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      */
      const winningLines = Game.getWinningLines()
      //here: iterate through the winning lines and check if 'i' is in the winning line. If so, return true. Else, return false.
      for (let j = 0; j < winningLines.length; j++) {
        const [a, b, c] = winningLines[j]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && winningLines[j].includes(i)) {
          return true
        }
      }
    }
  }
  

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length-1]
    const squares = current.squares.slice()
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

    squares[i] = this.state.xIsNext ? 'X' : 'O'
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
    const winner = calculateWinner(current.squares)
    const isCatGame = this.checkIfCatGame(current.squares)


    const moves = history.map((step, move) => {
      const description = move ? 'Go to move #' + move : 'Go to game start'
      const selectedIndex = step.selectedIndex      
      const clickLocation = this.determineClickLocation(selectedIndex)
      
      //for each element in history, display it by index as a list item:
      //We return an array of list items and render it.
      //It’s strongly recommended that you assign proper keys whenever you build dynamic lists.
      //Generally, don't use index as key, but here it is fine because we aren't swapping array positions
      return (
        <li key={move} style={{fontWeight: move===this.state.stepNumber ? 700:400}}>
          <button onClick={()=>this.jumpTo(move)} > {description}</button> <label>{clickLocation}</label>
        </li>
      )//put in the location of the move here => based on current
    })

    let status;
    if(winner){
      status = 'Winner: ' + winner
    } else if(isCatGame){
      status = `Cat's game 🐈`
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }
   
    return (
      <div className="game">
        <div  className="game-board">
          <Board 
            isUsedForVictory= {(i) => this.checkIfUsedForVictory(i)}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            isCatGame ={isCatGame}
          />
        </div>
        <div className="game-info">
          <div
          >
            {status}</div>
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

//This function goes through the winning lines and returns the winning side: 'X' or 'O'.
  //If there is no winner, return null.
function calculateWinner(squares) {
  const winningLines = Game.getWinningLines()

  for (let i = 0; i < winningLines.length; i++) {
    const [a, b, c] = winningLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}


