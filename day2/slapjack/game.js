var _ = require('underscore');
var persist = require('./persist');
var readGame = false;

var Card = function(suit, value) {
  this.value = value;
  this.suit = suit;
};

Card.prototype.toString = function() {
  if (this.value === 1) {
    return 'Ace of ' + this.suit;
  } else if (this.value === 13) {
    return 'King of ' + this.suit;
  } else if (this.value === 12) {
    return 'Queen of ' + this.suit;
  } else if (this.value === 11) {
    return 'Jack of ' + this.suit;
  } else {
    return this.value + ' of ' + this.suit;
  }
};

var Player = function(username) {
  this.username = username;
  this.id = this.generateId();
  this.pile = [];
};

Player.prototype.generateId = function() {
  function id() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return id() + id();
};

var Game = function() {
  this.Card = Card;
  this.Player = Player;
  this.isStarted = false;
  this.currentPlayer = null;
  this.players = {};
  this.playerOrder = [];
  this.pile = [];
};


// Make sure the game is not started and the username is valid
// Add Player to playerOlder
// return player id
Game.prototype.addPlayer = function(username) {
  if (this.isStarted) {
    console.log('Game started, join later');
    throw err;
  } else if (!username) {
    console.log('Invalid username');
    throw err;
  } else {
    _.forEach(this.players, function(item) {
      if (item.username === username) {
        throw err;
      }
    })
  }
  var newPlayer = new Player(username);
  this.players[newPlayer.id] = newPlayer;
  this.playerOrder.push(newPlayer.id);
  return newPlayer.id;
};


// Use this.playerOrder and this.currentPlayer to figure out whose turn it is next!
Game.prototype.nextPlayer = function() {
  if (this.isStarted === false) {
    console.log('Game not started');
    throw err;
  }
  var next;
  var i = this.playerOrder.indexOf(this.currentPlayer);
  if (i === this.playerOrder.length - 1) {
    next = 0;
  } else {
    next = i + 1;
  }
  var nextOne = this.playerOrder[next];
  if (this.players[nextOne].pile.length === 0) {
    this.playerOrder.splice(next,1);
    nextOne = this.playerOrder[next];
  }
  console.log('before', this.players[this.currentPlayer].username);
  this.currentPlayer = nextOne;
    console.log('after', this.players[this.currentPlayer].username);
  return nextOne;
};


/* Make sure to
  1. Create the Deck
  2. Shuffle the Deck
  3. Distribute cards from the pile
*/

var shuffle = function(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var index = Math.floor(Math.random() * i);
    var temp = array[index];
    array[index] = array[i];
    array[i] = temp;
  }
  return array;
}

Game.prototype.startGame = function() {

  if (this.isStarted === true) {
    console.log('Game already started.');
    throw err;
  } else if (this.playerOrder.length < 2) {
    console.log('Not enough players. Must have 2 to play');
    throw err;
  } else {
    this.isStarted = true;
  };

  for (var i = 1; i <= 13; i++) {
    this.pile.push(new Card('hearts', i));
    this.pile.push(new Card('diamonds', i));
    this.pile.push(new Card('spades', i));
    this.pile.push(new Card('clubs', i));
  }
  //Shuffle deck
  shuffle(this.pile);

  //Distribute cards
  var howMany = Math.floor(this.pile.length / this.playerOrder.length);
  for (var j = 0; j < howMany; j++) {
    for (var i = 0; i < this.playerOrder.length; i++) {
      this.players[this.playerOrder[i]].pile.push(this.pile.splice(0,1));
    }
  }
  this.currentPlayer = this.playerOrder[0];

};


// Check if the player with playerId is winning. In this case, that means he has the whole deck.
Game.prototype.isWinning = function(playerId) {
  if (!this.isStarted) {
    console.log('Game not yet started, no one is winning. Chill.');
    throw err;
  }
  return this.players[playerId].pile.length === 52;

};

// Play a card from the end of the pile
Game.prototype.playCard = function(playerId) {
  if (!this.started) {
    console.log('What are you playing if the game hasn\'t started');
    throw err;
  } else if (this.currentPlayer !== playerId) {
    console.log('Chill, wait your turn');
    throw err;
  } else if (this.players[playerId].pile.length === 0){
    console.log('No cards to play, sows bruh');
    throw err;
  }
    var current = this.players[playerId];
    var card = current.pile.pop();
    this.pile.push(card);
    var k = this.nextPlayer();
    return card.toString();

};


// If there is valid slap, move all items of the pile into the players Pile,
// clear the pile
// remember invalid slap and you should lose 3 cards!!
Game.prototype.slap = function(playerId) {
  if (!this.isStarted) {
    console.log('Game not started');
    throw err;
  }
  var topVal = this.pile[this.pile.length - 1].value;
  if (topVal === 11) {
    moveCards(this.pile, this.players[playerId.pile]);
    return true;
  }
  if (topVal === (this.pile[this.pile.length - 2].value)) {
    moveCards(this.pile, this.players[playerId.pile]);
    return true;
  }
  if (topVal === (this.pile[this.pile.length - 3].value)) {
    moveCards(this.pile, this.players[playerId.pile]);
    return true;
  }
  for (var i = 0; i < 3; i++) {
    var c = this.players[playerId].pile.pop();
    this.pile.unshift(c);
  }
  return false;
};

var moveCards = function(from, to) {
  while (from.length !== 0) {
    var card = from.pop();
    to.unshift(card);
  }
}


// PERSISTENCE FUNCTIONS

// Start here after completing Step 2!
// We have written a persist() function for you
// to save your game state to a store.json file.

// Determine in which gameplay functions above
// you want to persist and save your data. We will
// do a code-along later today to show you how
// to convert this from saving to a file to saving
// to Redis, a persistent in-memory datastore!

Card.prototype.fromObject = function(object) {
  this.value = object.value;
  this.suit = object.suit;
}

Card.prototype.toObject = function() {
  return {
    value: this.value,
    suit: this.suit
  };
}


Player.prototype.fromObject = function(object) {
  this.username = object.username;
  this.id = object.id;
  this.pile = object.pile.map(function(card) {
    var c = new Card();
    c.fromObject(card);
    return c;
  });
}

Player.prototype.toObject = function() {
  var ret = {
    username: this.username,
    id: this.id
  };
  ret.pile = this.pile.map(function(card) {
    return card.toObject();
  });
  return ret;
}

Game.prototype.fromObject = function(object) {
  this.isStarted = object.isStarted;
  this.currentPlayer = object.currentPlayer;
  this.playerOrder = object.playerOrder;

  this.pile = object.pile.map(function(card) {
    var c = new Card();
    c.fromObject(card);
    return c;
  });

  this.players = _.mapObject(object.players, function(player) {
    var p = new Player();
    p.fromObject(player);
    return p;
  });
}

Game.prototype.toObject = function() {
  var ret = {
    isStarted: this.isStarted,
    currentPlayer: this.currentPlayer,
    playerOrder: this.playerOrder
  };
  ret.players = {};
  for (var i in this.players) {
    ret.players[i] = this.players[i].toObject();
  }
  ret.pile = this.pile.map(function(card) {
    return card.toObject();
  });
  return ret;
}

Game.prototype.fromJSON = function(jsonString) {
  this.fromObject(JSON.parse(jsonString));
}

Game.prototype.toJSON = function() {
  return JSON.stringify(this.toObject());
}

Game.prototype.persist = function() {
  if (readGame && persist.hasExisting()) {
    this.fromJSON(persist.read());
    readGame = true;
  } else {
    persist.write(this.toJSON());
  }
}

module.exports = Game;
