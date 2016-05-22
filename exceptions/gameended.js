function GameEndedException() {
    this.message = "Game already ended!";
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, GameEndedException);
    else
        this.stack = (new Error()).stack;
}

GameEndedException.prototype = Object.create(Error.prototype);
GameEndedException.prototype.name = "GameEndedException";
GameEndedException.prototype.constructor = GameEndedException;
GameEndedException.prototype.errorCode = 403;

module.exports = GameEndedException;