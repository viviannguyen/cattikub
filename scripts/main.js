
var GameView = React.createClass({
  getInitialState: function(){
    return {g: new Game(),
            turn: 0};
  },
  handleStart: function(numPlayers){
    this.state.g.initializeGame(numPlayers);
    this.setState({turn: this.state.turn + 1});
  },
  handleRestart: function(event){
    event.preventDefault();
    this.state.g.resetBoard();
    this.setState({turn: this.state.turn});
  },
  handleSkip: function(event){
    event.preventDefault();
    this.state.g.skipTurn();
    this.setState({turn: this.state.turn + 1});
  },
  render: function() {
    if(this.state.turn > 0){
      return(
        <div className="game">
        <HandView hand={this.state.g.currPlayer.hand} game={this.state.g}/>
        <ResetBoardButton handleRestart={this.handleRestart}/>
        <SkipTurnButton handleSkip={this.handleSkip}/> 
        <BoardView/>
        </div>)
    }
    else{
      return (
        <div className="board">
          <StartGameForm onStart={this.handleStart}/>
        </div>
      );   
    }
  }
});

var BoardView = React.createClass({
  render: function(){
    return (<div id="gameBoard"></div>)
  }
});

var HandView = React.createClass({
  render: function() {
    var hand = this.props.hand.map(function(tile){
      return(<TileView tile={tile}/>);
    });
    return (
      <div className="hand">
        {hand}
      </div>
    );
  }
})

var TileView = React.createClass({
  render: function() {
    return (
      <div className="tile">
        <div className={"tileName " + this.props.tile.color}>{this.props.tile.number}</div>
        <div className="gameName">Cattikub</div>
      </div>
    );
  }
})

var SetView = React.createClass({
  // render the set of tiles
  render: function() {
    return (
      <div className="set">
      </div>
    );
  }
})

var StartGameForm = React.createClass({
  getInitialState: function(){
    return {players: 2,
            message: ''};
  },
  handleChange: function(event){
    this.setState({players: event.target.value});
  },
  handleClick: function(event){
    event.preventDefault();
    if(isNaN(parseInt(this.state.players)) || this.state.players < 2 || this.state.players > 4){
      this.setState({players: '',
                     message: 'Invalid number of players!'})
    }else{
      this.props.onStart(this.state.players);
    }
  },
  render: function(){
    return(
      <form className="startGameForm">
        <p> Please enter number of players(2-4) </p>
        <p style={{color: 'red'}}>{this.state.message}</p>
        <input value={this.state.players}
               onChange={this.handleChange}
               placeholder= '2-4'></input>
        <button onClick={this.handleClick}>Start Game </button>
      </form>
      )
  }
});

var ResetBoardButton = React.createClass({
  render: function(){
    return (<button onClick={this.props.handleReset} className="resetButton"> Reset Board </button>)
  }
});

var SkipTurnButton = React.createClass({
  render: function(){
    return (<button onClick={this.props.handleSkip} className="skipButton"> Skip Turn </button>)
  }
});

ReactDOM.render(
  <GameView/>,
  document.getElementById('content')
);
