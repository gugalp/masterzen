function MaximumAttemptsExceededException() {
    this.message = "Maximum number of attempts exceeded!";
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, MaximumAttemptsExceededException);
    else
        this.stack = (new Error()).stack;
}

MaximumAttemptsExceededException.prototype = Object.create(Error.prototype);
MaximumAttemptsExceededException.prototype.name = "MaximumAttemptsExceededException";
MaximumAttemptsExceededException.prototype.constructor = MaximumAttemptsExceededException;
MaximumAttemptsExceededException.prototype.errorCode = 403;

module.exports = MaximumAttemptsExceededException;