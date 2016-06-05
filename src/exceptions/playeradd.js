function PlayerAddException(message) {
    this.message = message;
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, PlayerAddException);
    else
        this.stack = (new Error()).stack;
}

PlayerAddException.prototype = Object.create(Error.prototype);
PlayerAddException.prototype.name = "PlayerAddException";
PlayerAddException.prototype.constructor = PlayerAddException;
PlayerAddException.prototype.errorCode = 403;

module.exports = PlayerAddException;
