function Config(colors, codeLength, maxAttempts, numberOfPlayers) {
    this.colors = colors instanceof Array ? colors : ["R", "G", "B", "Y"];
    this.codeLength = codeLength > 0 ? codeLength : 6;
    this.maxAttempts = maxAttempts > 0 ? maxAttempts : 10;
    this.numberOfPlayers = numberOfPlayers > 0 ? numberOfPlayers : 1;
};

module.exports = Config;