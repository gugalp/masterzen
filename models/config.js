function Config(colors, codeLength, maxAttempts, multiplayer)
{
    this.colors = colors || ["R", "G", "B", "Y"];
    this.codeLength = codeLength || 6;
    this.maxAttempts = maxAttempts || 10;
    this.multiplayer = multiplayer || false;
};

module.exports = Config;