class HttpError extends Error {
    constructor(message, errorCode) {
        //forward the message to Error constructor with super
        super(message); // Add a message property
        this.code = errorCode; // Add a code property
    }
}

module.exports = HttpError;