
var Game = function() {
  this.pool = [];
  this.board = new Board;
};

Game.prototype.initialize_game = function() {
  // (1) initialize the pool of types
  // two sets of each colors, and two special jokers red and black
  all_tiles = []
  for (i = 0; i < Tile.MAX_TILE_NO; i++) {
    for (j = 0; j < Tile.COLORS.length; j++) {
      all_tiles.push(new Tile(Tile.COLORS[j], i + 1));
    }
  }

  // two sets
  this.pool = all_tiles.concat(all_tiles);
  // jokers, -1 to indicate joker
  this.pool.append(new Tile("black", -1));
  this.pool.append(new Tile("red", -1));

  // (2) create players and draws tiles for them
  // FIXME: this is wrong...
  this.players = [new Player(0), new Player(1)];
  for (i = 0; i < this.players.length; i++) {
    p = this.players[i];
    for (j = 0; j < Game.STARTING_NO_OF_TILES; j++) {
      this.drawTile(p);
    }
  }
  // save the current state before a turn starts
  this.savedBoard = this.board;
  this.currPlayer = this.players[0];
  this.savedHand = this.currPlayer.hand;
}

Game.prototype.addToSet = function(set, tile) {
  set.add(tile);
};

Game.prototype.removeFromSet = function(set, tile) {
  set.remove(tile);
};

Game.prototype.createNewSet = function(tiles) {
  this.board.push(new Set(tiles));
};

Game.prototype.resetBoard = function() {
  this.board = this.savedBoard;
  this.currPlayer.hand = this.savedHand;
};

Game.prototype.changeTurns = function() {
  nextIndex = this.players.indexOf(this.currPlayer) + 1;
  this.currPlayer = this.players[nextIndex];
};

Game.prototype.drawTile = function(player) {
  rand_index = Math.floor(Math.random() * this.pool.length);
  var tile = this.pool[rand_index];
  tile.owner = player;
  this.pool.splice(index, 1);
  player.hand.push(tile);
};

Game.prototype.skipTurn = function() {
  this.drawTile(this.currPlayer);
  this.changeTurns();
};

Player.prototype.penalty = function() {
  for (i = 0; i < Game.PENALTY; i++) {
    this.drawTile(this.currPlayer);
  }
  this.changeTurns();
};

Game.prototype.checkTurn = function(player) {
  return this.currPlayer == player;
};

Game.PENALTY = 3
Game.STARTING_NO_OF_TILES = 14

var Board = function() {
  // has sets
}

Board.prototype.checkValidity = function() {
};

var Player = function(id) {
  // hand of tiles
  this.hand = [];
  // if init turn, must put down 30+ total
  this.initialTurn = true;
  this.id = id;
};

Player.prototype.endTurn = function() {
  isValid = Board.checkValidity();
  if (isValid) {
    Game.prototype.changeTurns();
  } else {
    // red shadow around wrong sets
    // yellow shadow around player's tiles
  };
};

var Set = function(tiles) {
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
Set.prototype.checkValidity = function() {
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

// Add tile to the tile list and update counters.
// Arguments: Tile to add.
// Returns: Nothing.
Set.prototype.addTile = function(tile){
  this.tiles.push(tile);
  this.numCount[tile.number] += 1;
  this.colorCount[tile.color] += 1;
}

// Remove tile of matching color and number from tile list and update counters, 
// Arguments: Tile to remove.
// Returns: bool of whether the tile was removed or not.
Set.prototype.removeTile = function(tile){
  for(var i = 0; i < this.tiles.length; i++){
    if(tile.color === this.tiles[i].color && tile.number == this.tiles[i].number){
      this.tiles.splice(i, 1);
      this.numCount[tile.number] -= 1;
      this.colorCount[tile.color] -= 1;
      return true;
    }
  }
  return false;
}

var Tile = function(color, number) {
  this.color = color;
  this.number = number;
  this.isJoker = false;
  this.owner = undefined;

}

Tile.MAX_TILE_NO = 13;
Tile.TILE_COLORS = ["blue", "orange", "red", "black"]

