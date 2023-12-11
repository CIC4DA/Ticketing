import { CustomError } from "./custom-error(parent-Class)/custom-error";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;
    reason = "Not Authorized";

    constructor() {  
        super("Not Authorized");

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeError() {
        return [{message : this.reason}]
    }
}

