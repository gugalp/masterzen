function Player(name) {
    this.name = name;
    this.turn = false;
    this.guesses = [];
}

Player.prototype.guess = function(sequence) {
    var guess = new Guess(sequence, 0, 0);

    this.guesses.push(guess);
};

module.exports = Player;