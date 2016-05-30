// Game object.  Contains the board, players, pool of tiles.
// Arguments: None
// Return: Game object
var Game = function() {
  this.pool = [];
  this.board = new Board;
};

// Initialize the game.
// (1) initialize the pool of types:
//    two sets of each colors, and two special jokers red and black
// (2) create players and draws tiles for them
// (3) Set the current player (currPlayer), save the state (savedBoard, savedHand)
// Arguments: None.
// Return: removed tile.
Game.prototype.initializeGame = function() {
  all_tiles = []
  for (i = 0; i < Tile.MAX_TILE_NO; i++) {
    for (j = 0; j < Tile.TILE_COLORS.length; j++) {
      all_tiles.push(new Tile(Tile.TILE_COLORS[j], i + 1));
    }
  }

  // two sets
  this.pool = all_tiles.concat(all_tiles);

  // jokers, -1 to indicate joker
  this.pool.push(new Tile("black", 0));
  this.pool.push(new Tile("red", 0));

  // FIXME: this is wrong...
  this.players = [new Player(0), new Player(1)];
  for (i = 0; i < this.players.length; i++) {
    p = this.players[i];
    for (j = 0; j < Game.STARTING_NO_OF_TILES; j++) {
      this.drawTile(p);
    }
  }
  // save the current state before a turn starts
  this.savedBoard = new Board();
  this.currPlayer = this.players[0];
  this.savedHand = this.currPlayer.hand.slice(0);
}

// Create a set and add it to the board.
// Arguments: Tile.
// Return: True.
Game.prototype.createSet = function(tile) {
  new_set = new gameSet([tile]);
  g.board.sets.push(new_set);
  return true;
};

// Reset the board to the previous state (the board and hand).
// Arguments: None.
// Return: True.
Game.prototype.resetBoard = function() {
  this.board = this.savedBoard;
  this.savedBoard = Board.copy(this.board.sets);
  this.currPlayer.hand = this.savedHand;
  return true;
};

// End a players turn.
// Arguments: None
// Return: true if changed turns, false if unvalidated
Game.prototype.endTurn = function() {
  isValid = g.board.checkValidity();
  if (isValid) {
    this.changeTurns(false);
    return true;
  } else {
    throw "Can't end turn.  Invalid state"
  };
};

// Change the turns from player to player.
// (1) If it's the first turn, make sure the tiles put down add up to 30.
// (2) Check for the win condition.
// (3) Save state, change turn.
// Arguments: If player skipped or not.
// Return: removed tile.
Game.prototype.changeTurns = function(skipped) {
  if (this.currPlayer.initialTurn && !skipped) {
    // take board - saved board = tiles put down, sum left over
    boardTiles = this.savedBoard.flatten();
    newTiles = $(this.board.flatten()).not(boardTiles).get();
    tots = newTiles.reduce( (prev, curr) => prev + curr.number, 0);
    if (tots < 30) {
      alert("Tiles put down is less than 30");
    } else {
      this.currPlayer.initialTurn = false;
    }
  } else if (this.checkWin()) {
    this.endGame(this.currPlayer);
    return;
  }
  nextIndex = (this.players.indexOf(this.currPlayer) + 1) % this.players.length;
  this.currPlayer = this.players[nextIndex];
  this.savedBoard = Board.copy(this.board.sets);
  this.savedHand = this.currPlayer.hand.slice(0);
};

// FIX ME
// Does something when the game ends
// Arguments:
// Return:
Game.prototype.endGame = function() {
  // end the game?!!
}

// Checks for the win condition (when there's nothing left in the players hand).
// Arguments: player
// Return: true or false
Game.prototype.checkWin = function() {
  return this.currPlayer.hand.length == 0;
}

// Remove tile from the current players hand.
// Arguments: Tile to be removed
// Return: Tile removed
Game.prototype.removeFromHand = function(tile) {
  index = this.currPlayer.hand.indexOf(tile);
  this.currPlayer.hand.splice(index, 1);
  return tile;
}

// Add a tile to the players hand.
// Arguments: player
// Return: None
Game.prototype.drawTile = function(player) {
  rand_index = Math.floor(Math.random() * this.pool.length);
  var tile = this.pool.splice(rand_index, 1)[0];
  tile.owner = player;
  player.hand.push(tile);
};

Game.prototype.drawTileNonrandom = function(player) {
  var tile = this.pool.splice(0, 1)[0];
  tile.owner = player;
  player.hand.push(tile);
};

// Skip the current players turn.
// (1) Draw a tile.
// (2) Switch turns.
// Arguments: None
// Return: None
Game.prototype.skipTurn = function() {
  this.drawTile(this.currPlayer);
  this.changeTurns(true);
};

// Penalty is the draw 3 tiles.
// Arguments: None
// Return: None
Game.prototype.penalty = function() {
  for (i = 0; i < Game.PENALTY; i++) {
    this.drawTile(this.currPlayer);
  }
  this.changeTurns(true);
};

Game.PENALTY = 3;
Game.STARTING_NO_OF_TILES = 14;

// Represents the game board that has all the sets on it.
// Arguments: None
// Return: Board object
var Board = function() {
  this.sets = [];
}

// Make a new board given set.  Used to make a deep copy of original board to save state.
// Arguments: Sets
// Return: Board object
Board.copy = function(sets) {
  b = new Board();
  for (var i = 0; i < sets.length; i++){
    b.sets.push(new gameSet(sets[i].tiles.slice()));
  }
  return b;
}

// Check the validity of all the sets on the board.
// Arguments: None.
// Return: if the board is valid
Board.prototype.checkValidity = function() {
  for (i = 0; i < this.sets.length; i++) {
    if (!this.sets[i].checkValidity()) {
      return false;
    }
  }
  return true;
};

// Flatten all tiles into a list of tiles.
// Arguments: None.
// Return: List of all tiles on the board.
Board.prototype.flatten = function() {
  all_tiles = [];
  for (i=0; i < this.sets.length; i++) {
    all_tiles = all_tiles.concat(this.sets[i].tiles);
  }
  return all_tiles;
};

// Add tile to the tile list and update counters.
// Arguments: Tile to add, 0 for beginning, 1 for end.
// Returns: Nothing.
Board.prototype.addTile = function(set, tile, end){
  if (end) {
    set.tiles.push(tile);
  } else {
    set.tiles.unshift(tile);
  }
  set.numCount[tile.number] += 1;
  set.colorCount[tile.color] += 1;
}

// Remove tile of matching color and number from tile list and update counters, 
// Arguments: Tile to remove, 0 for beginning, 1 for end.
// Return: removed tile.
Board.prototype.removeTile = function(set, tile){
  var i = set.tiles.indexOf(tile);
  // split it into 2 sets and return removed tile
  var before_set = set.tiles.slice(0, i)
  var later_set = set.tiles.slice(i)
  var removed = later_set.splice(0, 1)[0];
  // remove the old set and add the new sets to the board
  i_of_set = this.sets.indexOf(set);
  this.sets.splice(i_of_set, 0);
  this.sets.push(new gameSet(before_set));
  this.sets.push(new gameSet(later_set));
  return removed;
}

// Create player object, has a hand and id.
// Arguments: id
// Return: Player object
var Player = function(id) {
  // hand of tiles
  this.hand = [];
  // if init turn, must put down 30+ total
  this.initialTurn = true;
  this.id = id;
};

// Represents a game set on the board.
// Arguments: tiles to make up a set
// Return: Game set object
var gameSet = function(tiles) {
  // 3+ tiles
  // run set: run of the same color
  // group set: group of same number, but different colors
  this.tiles = tiles;
  this.colorCount = {
    "red": 0,
    "blue": 0,
    "orange": 0,
    "black": 0
  };
  this.numCount = {};
  for(var i = 0; i < 14; i++){
    this.numCount[i] = 0;
  }
  for(var i = 0; i < this.tiles.length; i++){
    this.numCount[this.tiles[i].number] += 1;
    this.colorCount[this.tiles[i].color] += 1;
  }
};

// Check that a set is valid. Use counters of colors and numbers to ensure
// uniqueness of colors and numbers. For runs, iterate through all numbers
// and check for gaps in the sequence, and whether or not a joker is used.
// Arguments: None.
// Returns: a boolean.
gameSet.prototype.checkValidity = function() {
  if(this.tiles.length < 3){
    return false
  }
  // Get which numbers and colors are represented once or not at all.
  var colorRes = onesAndZeros(this.colorCount);
  var numRes = onesAndZeros(this.numCount);

  if(colorRes[1] + colorRes[0] == 4){
    if(numRes[0] === 13 || (numRes[0] === 12 && this.numCount[0] > 0)){
      return true;
    }
  } else if (colorRes[0] == 3){
    if (numRes[1]+numRes[0] < 14){
      return false
    }
    var jokerUsed = false;
    var runStarted = false;
    var runEnded = false;
    for(var i=1; i < 14; i++){
      if(this.numCount[i] === 1 && !runStarted){
        runStarted = true;
      //We've encountered a gap in the runuence, check if there's a joker used.
      }else if(this.numCount[i] === 0 && runStarted){
        if(this.numCount[0] === 1 && jokerUsed){
          runEnded = true;
        }else{
          jokerUsed = true;
        }
      //If there are any other numbers after a gap, it's invalid.
      }else if(this.numCount[i] === 1 && runEnded){
        return false
      }
    }
    if(runStarted){
      return true;
    }
  }
  return false;

};

// Count the number of times a category is 1 or 0 and return the results.
// Arguments: An Object that has numbers as values
// Returns: zeros: the number of items that were zero
//          ones: the number of items that were one
function onesAndZeros(counter){
  var ones = 0;
  var zeros = 0;
  Object.keys(counter).forEach(function (key){
    if (counter[key] === 1){
      ones += 1;
    } if(counter[key] === 0){
      zeros +=1;
    }
  });
  return [zeros, ones];
}

// Tile object, has a color, number, owner.
// Arguments: None
// Return: Tile object
var Tile = function(color, number) {
  this.color = color;
  this.number = number;
  this.owner = undefined;

}

Tile.MAX_TILE_NO = 13;
Tile.TILE_COLORS = ["blue", "orange", "red", "black"];

// Log an array of tiles.
// Arguments: Array of tiles.
// Return: String of tile info.
Game.logTiles = function(hand) {
 h = "";
  for (i=0; i < hand.length; i++) {
    tile = hand[i].color + ": " + hand[i].number + ", ";
    h += tile;
  }
  return h;
}

// Test a new game
g = new Game
all_tiles = []
for (i = 0; i < Tile.TILE_COLORS.length; i++) {
  for (j = 0; j < Tile.MAX_TILE_NO; j++) {
    all_tiles.push(new Tile(Tile.TILE_COLORS[i], j + 1));
  }
}
// two sets
g.pool = all_tiles.concat(all_tiles);

// jokers, -1 to indicate joker
g.pool.push(new Tile("black", 0));
g.pool.push(new Tile("red", 0));

g.players = [new Player(0), new Player(1)];
for (i=0; i < g.players.length; i++) {
  for (j=0; j<14; j++) {
    g.drawTileNonrandom(g.players[i]);
  }
}

// save the current state before a turn starts
g.savedBoard = new Board();
g.currPlayer = g.players[0];
g.savedHand = g.currPlayer.hand;
t = g.currPlayer.hand[0];
g.removeFromHand(t);
g.createSet(t);
for (i=0; i<10; i++) {
  t = g.currPlayer.hand[0];
  g.removeFromHand(t);
  g.board.addTile(g.board.sets[0], t, 1);
}

g.endTurn();
g.skipTurn();

