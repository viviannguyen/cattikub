
var GameView = React.createClass({
  getInitialState: function(){
    return {g: new Game(),
            turn: 0};
  },
  handleStart: function(numPlayers){
    this.state.g.initializeGame(numPlayers);
    this.setState({turn: this.state.turn + 1});
  },
  handleReset: function(event){
    event.preventDefault();
    this.state.g.resetBoard();
    this.setState({turn: this.state.turn});
  },
  handleSkip: function(event){
    event.preventDefault();
    this.state.g.skipTurn();
    this.setState({turn: this.state.turn + 1});
  },
  handleEnd: function(event){
    event.preventDefault();
    this.state.g.endGame();
    this.setState({turn: 0, g: new Game()});
  },
  handleSelect: function(tile){
    this.setState({selectedTile: tile})
  },
  handleNewSet: function(){
    if (this.state.selectedTile === undefined){
      return
    }else{
      //FIXME: Remove from sets too, not just Hand.
      this.state.g.removeFromHand(this.state.selectedTile);
      this.state.g.createSet(this.state.selectedTile);
      this.setState({selectedTile: undefined});
    }
  },
  handleAddToSet: function(set){
    if(this.state.selectedTile === undefined){
      return
    }
    var removed = this.state.g.removeFromHand(this.state.selectedTile);
    this.state.g.board.addTile(set, this.state.selectedTile, true);
    this.setState({selectedTile: undefined});
  },
  render: function() {
    if(this.state.turn > 0){
      return(
        <div id="container">
          <div id="infoBar">
            <p className="title">Cattikub</p>
            <ResetBoardButton handleReset={this.handleReset}/>
            <SkipTurnButton handleSkip={this.handleSkip}/>
            <EndGameButton handleEnd={this.handleEnd}/>
          </div> 
          <div className="game">
            <p> Player {this.state.g.currPlayer.id}'s turn </p>
            <HandView hand={this.state.g.currPlayer.hand} handleSelect={this.handleSelect}/>
            <BoardView handleNewSet={this.handleNewSet} handleSelect={this.handleSelect}
                       sets={this.state.g.board.sets} handleAddToSet={this.handleAddToSet}/>
          </div>
        </div>)
    }
    else{
      return (
        <div id="container">
            <div id="infoBar">
              <p className="title">Cattikub</p>
            </div> 
          <div className="game">
            <StartGameForm handleStart={this.handleStart}/>
          </div>
        </div>
      );   
    }
  }
});

var BoardView = React.createClass({
  render: function(){
    if(this.props.sets !== undefined && this.props.sets.length > 0){
      var handleSelect = this.props.handleSelect;
      var handleAddToSet = this.props.handleAddToSet;
      var Sets = this.props.sets.map(function(set){
        return (<SetView set={set} handleSelect={handleSelect} handleAddToSet={handleAddToSet}/>)
      });
    }else{
      var Sets = null;
    }
    return (<div id="gameBoard">
              {Sets}
              <NewSetButton handleNewSet={this.props.handleNewSet}/>
            </div>)
  }
});

var HandView = React.createClass({
  render: function() {
    var handleSelect = this.props.handleSelect;
    var hand = this.props.hand.map(function(tile){
      return(<TileView tile={tile} handleSelect={handleSelect}/>);
    });
    return (
      <div className="hand">
        {hand}
      </div>
    );
  }
})

var TileView = React.createClass({
  handleJoker: function(){
    if(this.props.tile.number == 0){
      return (<div className={"tileName " + this.props.tile.color}>
        <svg className="joker" x="0px" y="0px"
            viewBox="0 0 403.801 367.781"
           enable-background="new 0 0 403.801 367.781">
        <circle fill="none" cx="201.9" cy="209.693" r="151"/>
        <circle fill="none" cx="139.9" cy="157.603" r="26"/>
        <circle fill="none" cx="258.1" cy="157.603" r="26"/>
        <line fill="none" x1="302" y1="245.07" x2="403.801" y2="245.07"/>
        <line fill="none" x1="302" y1="277.07" x2="403.801" y2="277.07"/>
        <line fill="none" x1="302" y1="310.316" x2="403.801" y2="310.316"/>
        <line fill="none" x1="0" y1="244.449" x2="101.801" y2="244.449"/>
        <line fill="none" x1="0" y1="276.449" x2="101.801" y2="276.449"/>
        <line fill="none" x1="0" y1="309.693" x2="101.801" y2="309.693"/>
        <polyline fill="none" points="86.711,112.07 86.711,13.693 159.06,64.868 "/>
        <polyline fill="none" points="320.273,114.07 320.273,15.693 247.925,66.869 "/>
        <polyline fill="none" points="150.9,277.07 201.9,239.693 247.925,276.449 "/>
        </svg>
        </div>);
    }else{
      return (<div className={"tileName " + this.props.tile.color}>{this.props.tile.number}</div>);
    }
  },
  handleSelect: function(){
    this.props.handleSelect(this.props.tile);
  },
  render: function() {
    return (
      <div className="tile" onClick={this.handleSelect}>
        {this.handleJoker()}
        <div className="gameName">Cattikub</div>
      </div>
    );
  }
})

var SetView = React.createClass({
  // render the set of tiles
  render: function() {
    var handleSelect = this.props.handleSelect;
    var Tiles = this.props.set.tiles.map(function(tile){
      return(<TileView tile={tile} handleSelect={handleSelect}/>);
    })
    return (
      <div className="set">
      {Tiles}
      <AddToSetButton handleAddToSet={this.props.handleAddToSet} set={this.props.set}/>
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
      this.props.handleStart(this.state.players);
    }
  },
  render: function(){
    return(
      <form className="startGameForm">
        <p> Please enter number of players(2-4) </p>
        <p style={{color: 'red'}}>{this.state.message}</p>
        <div className="inputButton">
          <input value={this.state.players}
                 onChange={this.handleChange}
                 placeholder= '2-4'></input>
          <button onClick={this.handleClick}>Start Game </button>
        </div>  
      </form>
      )
  }
});

var ResetBoardButton = React.createClass({
  render: function(){
    return (<button onClick={this.props.handleReset} className="infoBarButton"> Reset Board </button>)
  }
});

var SkipTurnButton = React.createClass({
  render: function(){
    return (<button onClick={this.props.handleSkip} className="infoBarButton"> Skip Turn </button>)
  }
});

var EndGameButton = React.createClass({
  render: function(){
    return (<button onClick={this.props.handleEnd} className="infoBarButton"> End Game </button>)
  }
})

var NewSetButton = React.createClass({
  render: function(){
    return(<div onClick={this.props.handleNewSet} className="newSet">+ Add Set </div>)
  }
})

var AddToSetButton = React.createClass({
  handleAddToSet: function(){
    this.props.handleAddToSet(this.props.set);
  },
  render: function(){
    return(<div onClick={this.handleAddToSet} className="addSet">+</div>)
  }
})

ReactDOM.render(
  <GameView/>,
  document.getElementById('content')
);
