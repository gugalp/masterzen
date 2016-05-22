function GameTurnException() {
    this.message = "Guessing not allowed until all players send their guesses!";
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, GameTurnException);
    else
        this.stack = (new Error()).stack;
}

GameTurnException.prototype = Object.create(Error.prototype);
GameTurnException.prototype.name = "GameTurnException";
GameTurnException.prototype.constructor = GameTurnException;
GameTurnException.prototype.errorCode = 403;

module.exports = GameTurnException;