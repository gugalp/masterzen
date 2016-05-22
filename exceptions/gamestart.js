function GameStartException() {
    this.message = "All players must join before the game starts!";
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, GameStartException);
    else
        this.stack = (new Error()).stack;
}

GameStartException.prototype = Object.create(Error.prototype);
GameStartException.prototype.name = "GameStartException";
GameStartException.prototype.constructor = GameStartException;

module.exports = GameStartException;