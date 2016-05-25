
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
      all_tiles.push(new Tile(Tile.COLORS[j], i + 1))
    }
  }

  // two sets
  this.pool = all_tiles.concat(all_tiles);
  // jokers, -1 to indicate joker
  this.pool.append(new Tile("black", -1));
  this.pool.append(new Tile("red", -1));

  // (2) create players and draws tiles for them
  // FIXME: this is wrong...
  this.players = [new Player(1), new Player(2)];
  for (i = 0; i < this.players.length; i++) {
    p = this.players[i];
    for (j = 0; j < Game.STARTING_NO_OF_TILES; j++) {
      this.drawTile(p);
    }
  }
}

Game.prototype.addToSet = function(tile) {
};

Game.prototype.removeFromSet = function(tile) {
};

Game.prototype.createNewSet = function(tiles) {
};

Game.prototype.resetBoard = function() {
};

Game.prototype.changeTurns = function() {
};

Game.prototype.drawTile = function(player) {
  rand_index = Math.floor(Math.random() * this.pool.length)
  var tile = this.pool[rand_index];
  this.pool.splice(index, 1);
  player.hand.push(tile)
};

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
  this.id = id
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

Player.prototype.skipTurn = function() {
};

Player.prototype.penalty = function() {
};

var Set = function(tiles) {
  // 3+ tiles
  // run set: run of the same color
  // group set: group of same number, but different colors
};

Set.prototype.checkValidity = function() {
};

var Tile = function(color, number) {
  this.color = color;
  this.number = number;
  this.isJoker = false;
  this.owner = undefined;

}

Tile.MAX_TILE_NO = 13;
Tile.TILE_COLORS = ["blue", "orange", "red", "yellow"]

