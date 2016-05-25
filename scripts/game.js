
var Game = function() {
  this.pool = [];
  this.board = new Board;
};

Game.prototype.initialize_game = function() {
  // (1) initialize the pool of types
  // two sets of each colors, and two special jokers red and black


  // (2) create players and draws tiles for them
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

Game.prototype.drawTile = function() {
};

var Board = function() {
  // has sets
}

Board.prototype.checkValidity = function() {
};

var Player = function() {
  // hand of tiles
  this.hand = [];
  // if init turn, must put down 30+ total
  this.initialTurn = true;
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
  this.owner = undefined;
}

