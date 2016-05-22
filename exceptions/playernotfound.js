function PlayerNotFoundException() {
    this.message = "Player not found!";
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, PlayerNotFoundException);
    else
        this.stack = (new Error()).stack;
}

PlayerNotFoundException.prototype = Object.create(Error.prototype);
PlayerNotFoundException.prototype.name = "PlayerNotFoundException";
PlayerNotFoundException.prototype.constructor = PlayerNotFoundException;

module.exports = PlayerNotFoundException;