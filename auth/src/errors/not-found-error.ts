import { CustomError } from "./custom-error(parent-Class)/custom-error";

export class NotFoundError extends CustomError{
    statusCode= 404;
    reason= "Not Found";

    constructor() {  
        super('Route Not Found, NotFoundError');

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeError() {
        return [{message : this.reason}]
    }
}