var Guess = require("./guess");

function Player(name) {
    this.name = name;
    this.turn = false;
    this.guesses = [];
}

Player.prototype.addGuess = function (sequence, exact, hit) {
    var guess = new Guess(sequence, exact, hit);

    this.guesses.push(guess);
};

module.exports = Player;