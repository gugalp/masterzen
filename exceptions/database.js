function DatabaseException(message) {
    this.message = message || "Unknown database error!";
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, DatabaseException);
    else
        this.stack = (new Error()).stack;
}

DatabaseException.prototype = Object.create(Error.prototype);
DatabaseException.prototype.name = "DatabaseException";
DatabaseException.prototype.constructor = DatabaseException;
DatabaseException.prototype.errorCode = 500;

module.exports = DatabaseException;