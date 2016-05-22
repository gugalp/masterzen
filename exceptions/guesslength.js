function GuessLengthException() {
    this.message = "Guessing sequence length must match master code length!";
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, GuessLengthException);
    else
        this.stack = (new Error()).stack;
}

GuessLengthException.prototype = Object.create(Error.prototype);
GuessLengthException.prototype.name = "GuessLengthException";
GuessLengthException.prototype.constructor = GuessLengthException;
GuessLengthException.prototype.errorCode = 403;

module.exports = GuessLengthException;